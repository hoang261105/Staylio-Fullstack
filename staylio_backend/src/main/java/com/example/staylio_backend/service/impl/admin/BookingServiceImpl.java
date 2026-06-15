package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.*;
import com.example.staylio_backend.dto.response.*;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.*;
import com.example.staylio_backend.repository.*;
import com.example.staylio_backend.service.BookingService;
import com.example.staylio_backend.service.NotificationService;
import com.example.staylio_backend.service.TravelokaIntegrationService;
import com.example.staylio_backend.service.ZaloPayService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepo bookingRepo;
    private final ProfileRepo profileRepo;
    private final RoomRepo roomRepo;
    private final UserVoucherRepo userVoucherRepo;
    private final UserRepo userRepo;
    private final PaymentRepo paymentRepo;
    private final NotificationService notificationService;
    private final ZaloPayService zaloPayService;
    private final TravelokaIntegrationService travelokaIntegrationService;

    @Override
    public PaginationResponse<BookingResponse> getAllBookings(
            BookingFilterRequest request,
            UserPrincipal principal) {
        int page = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(
                page,
                request.getSize(),
                getSort(request.getSortBy(), request.getDirection()));

        String search = request.getSearch();
        search = (search == null || search.isBlank()) ? null : search.trim();

        Page<Booking> bookingsPage;

        if (principal.hasRole(RoleName.ROLE_ADMIN)) {
            bookingsPage = bookingRepo.searchBookings(
                    search,
                    request.getStatus(),
                    request.getPaymentStatus(),
                    request.getPaymentMethod(),
                    request.getHotelBranchId(),
                    request.getRoomId(),
                    request.getUserId(),
                    request.getCheckInFrom(),
                    request.getCheckInTo(),
                    request.getCheckOutFrom(),
                    request.getCheckOutTo(),
                    pageable);
        } else if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

            bookingsPage = bookingRepo.searchBookingsByManager(
                    profile.getId(),
                    search,
                    request.getStatus(),
                    request.getPaymentStatus(),
                    request.getHotelBranchId(),
                    request.getCheckInFrom(),
                    request.getCheckInTo(),
                    request.getCheckOutFrom(),
                    request.getCheckOutTo(),
                    pageable);
        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<BookingResponse> content = bookingsPage.getContent()
                .stream()
                .map(this::convertToResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                bookingsPage.getNumber() + 1,
                bookingsPage.getSize(),
                bookingsPage.getTotalPages(),
                bookingsPage.getTotalElements());

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public BookingResponse getBookingById(Long id, UserPrincipal principal) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.BOOKING_NOT_FOUND.getMessage()));

        if (principal.getRoleName() == RoleName.ROLE_MANAGER) {
            validateManagerOwnership(booking, principal);
        }
        return convertToResponse(booking);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, BookingStatusRequest request, UserPrincipal principal) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.BOOKING_NOT_FOUND.getMessage()));

        Payment payment = booking.getPayments()
                .stream()
                .max(Comparator.comparing(Payment::getCreatedAt))
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.PAYMENT_NOT_FOUND.getMessage()));

        if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            validateManagerOwnership(booking, principal);
            updateByManager(booking, payment, request.getStatus(), request.getCancellationReason());
            return;
        }

        if (principal.hasRole(RoleName.ROLE_ADMIN)) {
            updateByAdmin(booking, payment, request.getStatus(), request.getCancellationReason());
            return;
        }

        if (principal.hasRole(RoleName.ROLE_CUSTOMER)) {
            updateByUser(
                    booking,
                    payment,
                    request.getStatus(),
                    request.getCancellationReason(),
                    principal);

            Profile managerProfile = booking.getRoom().getHotelBranch().getHotel().getManager();
            if (managerProfile != null) {
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .senderId(principal.getId())
                        .receiverId(managerProfile.getId())
                        .title("Có đơn hủy đặt phòng")
                        .content("Khách hàng " + principal.getFullName() + " vừa hủy đặt phòng "
                                + booking.getRoom().getRoomName() + " (Mã: " + booking.getBookingCode() + ")")
                        .type(NotificationType.BOOKING_CANCELLED)
                        .referenceId(id)
                        .build();

                notificationService.create(notificationRequest);
            }
            return;
        }

        throw new AppException(ErrorCode.UNAUTHORIZED);

    }

    @Override
    public BookingPreviewResponse previewBooking(
            BookingRequest request,
            UserPrincipal principal) {
        User user = userRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        Room room = roomRepo.findById(request.getRoomId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        validateBookingRequest(request, room);

        boolean isOverlap = bookingRepo.existsOverlappingBooking(
                room.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate());

        if (isOverlap) {
            throw new AppException(ErrorCode.ROOM_ALREADY_BOOKED);
        }

        long nights = ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate());

        BigDecimal originalPrice = room.getPrice()
                .multiply(BigDecimal.valueOf(nights));

        BigDecimal discountAmount = BigDecimal.ZERO;

        if (request.getUserVoucherId() != null) {
            UserVoucher userVoucher = validateVoucher(
                    request.getUserVoucherId(),
                    user,
                    room);

            discountAmount = calculateDiscount(
                    originalPrice,
                    userVoucher.getVoucher());
        }

        BigDecimal finalPrice = originalPrice.subtract(discountAmount);

        return BookingPreviewResponse.builder()
                .pricePerNight(room.getPrice())
                .nights(nights)
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .finalPrice(finalPrice)
                .build();
    }

    @Override
    @Transactional
    public BookingResponse createBooking(
            BookingRequest request,
            UserPrincipal principal) {
        User user = userRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        Room room = roomRepo.findById(request.getRoomId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        validateBookingRequest(request, room);

        boolean isOverlap = bookingRepo.existsOverlappingBooking(
                room.getId(),
                request.getCheckInDate(),
                request.getCheckOutDate());

        if (isOverlap) {
            throw new AppException(ErrorCode.ROOM_ALREADY_BOOKED);
        }

        long nights = ChronoUnit.DAYS.between(
                request.getCheckInDate(),
                request.getCheckOutDate());

        BigDecimal originalPrice = room.getPrice()
                .multiply(BigDecimal.valueOf(nights));

        BigDecimal discountAmount = BigDecimal.ZERO;
        UserVoucher userVoucher = null;

        if (request.getUserVoucherId() != null) {
            userVoucher = validateVoucher(
                    request.getUserVoucherId(),
                    user,
                    room);

            discountAmount = calculateDiscount(
                    originalPrice,
                    userVoucher.getVoucher());

            userVoucher.setStatus(UserVoucherStatus.USED);
            userVoucher.setUsedAt(LocalDateTime.now());
            userVoucher.setUsedCount(userVoucher.getUsedCount() == null ? 1 : userVoucher.getUsedCount() + 1);
            userVoucherRepo.save(userVoucher);

            Voucher voucher = userVoucher.getVoucher();
            voucher.setCurrentUsageCount(voucher.getCurrentUsageCount() == null ? 1 : voucher.getCurrentUsageCount() + 1);
        }

        BigDecimal finalPrice = originalPrice.subtract(discountAmount);

        Booking booking = Booking.builder()
                .user(user)
                .room(room)
                .checkInDate(request.getCheckInDate())
                .checkOutDate(request.getCheckOutDate())
                .adults(request.getAdults())
                .children(request.getChildren() == null ? 0 : request.getChildren())
                .originalPrice(originalPrice)
                .discountAmount(discountAmount)
                .finalPrice(finalPrice)
                .userVoucher(userVoucher)
                .bookingCode(generateBookingCode())
                .status(BookingStatus.PENDING_PAYMENT)
                .note(request.getNote())
                .preferences(request.getPreferences())
                .build();

        Booking savedBooking = bookingRepo.save(booking);

        Payment payment = Payment.builder()
                .booking(savedBooking)
                .paymentMethod(request.getPaymentMethod())
                .amount(finalPrice)
                .status(PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepo.save(payment);

        // Gọi API Traveloka để giảm trừ phòng (Mock)
        travelokaIntegrationService.pushInventory(room, request.getCheckInDate(), 0);

        if (request.getPaymentMethod() == PaymentMethod.ZALOPAY) {
            ZaloPayCreateOrderResponse zaloPayResponse = zaloPayService.createOrder(savedBooking, savedPayment);

            savedPayment.setGatewayOrderId(zaloPayResponse.getAppTransId());
            savedPayment.setPaymentUrl(zaloPayResponse.getPaymentUrl());
            savedPayment.setRawResponse(zaloPayResponse.getRawResponse());

            paymentRepo.save(savedPayment);
        }

        Profile managerProfile = room.getHotelBranch().getHotel().getManager();
        if (managerProfile != null) {
            NotificationRequest notificationRequest = NotificationRequest.builder()
                    .senderId(user.getProfile().getId())
                    .receiverId(managerProfile.getId())
                    .title("Có đơn đặt phòng mới")
                    .content("Khách hàng " + user.getProfile().getFullName() + " vừa đặt phòng " + room.getRoomName()
                            + " (Mã: " + savedBooking.getBookingCode() + ")")
                    .type(NotificationType.BOOKING_CREATED)
                    .referenceId(savedBooking.getId())
                    .build();

            notificationService.create(notificationRequest);
        }

        savedBooking.setPayments(Set.of(savedPayment));

        return convertToResponse(savedBooking);
    }

    @Override
    public List<DateRangeResponse> getBookedDates(Long roomId) {
        return bookingRepo.findBookedDatesByRoomId(roomId);
    }

    @Override
    public PaginationResponse<BookingHistoryResponse> getMyBookings(BookingHistoryRequest request,
            UserPrincipal principal) {
        Pageable pageable = PageRequest.of(
                Math.max(request.getPage() - 1, 0),
                request.getSize(),
                getSort(request.getSortBy(), request.getDirection()));

        Page<Booking> bookingPage = bookingRepo.searchBookingsByUser(
                principal.getId(),
                request.getSearch(),
                request.getStatus(),
                pageable);

        List<BookingHistoryResponse> responses = bookingPage.getContent()
                .stream()
                .map(this::convertToHistoryResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                bookingPage.getNumber() + 1,
                bookingPage.getSize(),
                bookingPage.getTotalPages(),
                bookingPage.getTotalElements());

        return new PaginationResponse<>(
                responses,
                paginationDTO);
    }

    private Sort getSort(String sortBy, String direction) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String safeSortBy = (sortBy == null || sortBy.isBlank())
                ? "createdAt"
                : sortBy;

        String property = switch (safeSortBy) {
            case "bookingCode" -> "bookingCode";
            case "status" -> "status";
            case "checkInDate" -> "checkInDate";
            case "checkOutDate" -> "checkOutDate";
            case "finalPrice" -> "finalPrice";
            case "customerName" -> "user.profile.fullName";
            case "roomName" -> "room.roomName";
            case "roomNumber" -> "room.roomNumber";
            case "hotelBranchName" -> "room.hotelBranch.hotelBranchName";
            case "createdAt" -> "createdAt";
            default -> "createdAt";
        };

        return Sort.by(dir, property);
    }

    private BookingResponse convertToResponse(Booking booking) {

        Payment latestPayment = booking.getPayments() != null
                ? booking.getPayments()
                        .stream()
                        .max(Comparator.comparing(Payment::getCreatedAt))
                        .orElse(null)
                : null;

        Voucher voucher = booking.getUserVoucher() != null
                ? booking.getUserVoucher().getVoucher()
                : null;

        String roomImage = booking.getRoom().getImages()
                .stream()
                .filter(image -> image.getStatus() == ImageStatus.CONFIRMED
                        && Boolean.TRUE.equals(image.getIsPrimary()))
                .map(RoomImage::getImageUrl)
                .findFirst()
                .orElse(null);

        long totalNights = ChronoUnit.DAYS.between(
                booking.getCheckInDate(),
                booking.getCheckOutDate());

        return new BookingResponse(
                booking.getId(),
                booking.getBookingCode(),
                booking.getStatus(),
                booking.getNote(),
                booking.getPreferences(),

                booking.getUser().getId(),
                booking.getUser().getProfile().getFullName(),
                booking.getUser().getEmail(),
                booking.getUser().getProfile().getPhone(),

                booking.getRoom().getId(),
                booking.getRoom().getRoomName(),
                booking.getRoom().getRoomNumber(),
                roomImage,

                booking.getRoom().getHotelBranch().getId(),
                booking.getRoom().getHotelBranch().getBranchName(),
                booking.getRoom().getHotelBranch().getHotel().getName(),

                booking.getCheckInDate(),
                booking.getCheckOutDate(),
                (int) totalNights,

                booking.getAdults(),
                booking.getChildren(),

                booking.getOriginalPrice(),
                booking.getDiscountAmount(),
                booking.getFinalPrice(),

                voucher != null ? voucher.getId() : null,
                voucher != null ? voucher.getCode() : null,
                voucher != null ? voucher.getTitle() : null,

                latestPayment != null ? latestPayment.getStatus() : null,
                latestPayment != null ? latestPayment.getPaymentMethod() : null,
                latestPayment != null ? latestPayment.getTransactionId() : null,
                latestPayment != null ? latestPayment.getPaymentUrl() : null,
                latestPayment != null ? latestPayment.getPaidAt() : null,

                booking.getConfirmedAt(),
                booking.getCancelledAt(),
                booking.getCheckedInAt(),
                booking.getCheckedOutAt(),
                booking.getCreatedAt());
    }

    private void updateByManager(
            Booking booking,
            Payment payment,
            BookingStatus newStatus,
            String cancellationReason) {
        BookingStatus current = booking.getStatus();

        if (newStatus == BookingStatus.CANCELLED) {
            if (current == BookingStatus.CHECKED_IN
                    || current == BookingStatus.CHECKED_OUT
                    || current == BookingStatus.REFUNDED
                    || current == BookingStatus.CANCELLED) {
                throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
            }

            if (cancellationReason == null || cancellationReason.isBlank()) {
                throw new AppException(ErrorCode.CANCELLATION_REASON_REQUIRED);
            }

            booking.setStatus(BookingStatus.CANCELLED);
            booking.setCancellationReason(cancellationReason.trim());
            booking.setCancelledAt(LocalDateTime.now());

            if (payment.getStatus() == PaymentStatus.PENDING) {
                payment.setStatus(PaymentStatus.CANCELLED);
            }

            return;
        }

        if (payment.getStatus() != PaymentStatus.PAID) {
            throw new AppException(ErrorCode.BOOKING_NOT_PAID);
        }

        if (current == BookingStatus.PAID && newStatus == BookingStatus.CONFIRMED) {
            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setConfirmedAt(LocalDateTime.now());
            return;
        }

        if (current == BookingStatus.CONFIRMED && newStatus == BookingStatus.CHECKED_IN) {
            booking.setStatus(BookingStatus.CHECKED_IN);
            booking.setCheckedInAt(LocalDateTime.now());

            booking.setExpectedCheckOutAt(
                    booking.getCheckOutDate().atTime(12, 0));

            booking.getRoom().setStatus(RoomStatus.OCCUPIED);

            return;
        }

        if (current == BookingStatus.CHECKED_IN && newStatus == BookingStatus.CHECKED_OUT) {
            booking.setStatus(BookingStatus.CHECKED_OUT);
            booking.setCheckedOutAt(LocalDateTime.now());
            return;
        }

        throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
    }

    private void updateByAdmin(
            Booking booking,
            Payment payment,
            BookingStatus newStatus,
            String cancellationReason) {
        BookingStatus current = booking.getStatus();

        if (newStatus == BookingStatus.CANCELLED) {
            if (current == BookingStatus.CHECKED_IN
                    || current == BookingStatus.CHECKED_OUT
                    || current == BookingStatus.REFUNDED
                    || current == BookingStatus.CANCELLED) {
                throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
            }

            if (cancellationReason == null || cancellationReason.isBlank()) {
                throw new AppException(ErrorCode.CANCELLATION_REASON_REQUIRED);
            }

            booking.setStatus(BookingStatus.CANCELLED);
            booking.setCancellationReason(cancellationReason.trim());
            booking.setCancelledAt(LocalDateTime.now());

            if (payment.getStatus() == PaymentStatus.PENDING) {
                payment.setStatus(PaymentStatus.CANCELLED);
            }

            return;
        }

        if (newStatus == BookingStatus.REFUNDED) {
            if (payment.getStatus() != PaymentStatus.PAID) {
                throw new AppException(ErrorCode.BOOKING_NOT_PAID);
            }

            booking.setStatus(BookingStatus.REFUNDED);
            payment.setStatus(PaymentStatus.REFUNDED);
            return;
        }

        if (current == BookingStatus.PAID && newStatus == BookingStatus.CONFIRMED) {
            if (payment.getStatus() != PaymentStatus.PAID) {
                throw new AppException(ErrorCode.BOOKING_NOT_PAID);
            }

            booking.setStatus(BookingStatus.CONFIRMED);
            booking.setConfirmedAt(LocalDateTime.now());
            return;
        }

        throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
    }

    private void updateByUser(
            Booking booking,
            Payment payment,
            BookingStatus newStatus,
            String cancellationReason,
            UserPrincipal principal) {

        if (!booking.getUser().getId().equals(principal.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (newStatus != BookingStatus.CANCELLED) {
            throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
        }

        if (booking.getStatus() == BookingStatus.CHECKED_IN
                || booking.getStatus() == BookingStatus.CHECKED_OUT
                || booking.getStatus() == BookingStatus.REFUNDED) {

            throw new AppException(ErrorCode.BOOKING_CANNOT_BE_CANCELLED);
        }

        booking.setStatus(BookingStatus.CANCELLED);
        booking.setCancelledAt(LocalDateTime.now());
        booking.setCancellationReason(cancellationReason);

        if (payment.getStatus() == PaymentStatus.PAID) {

            payment.setStatus(PaymentStatus.REFUNDED);

        } else if (payment.getStatus() == PaymentStatus.PENDING) {

            payment.setStatus(PaymentStatus.CANCELLED);
        }

        bookingRepo.save(booking);
        paymentRepo.save(payment);
    }

    private void validateManagerOwnership(Booking booking, UserPrincipal principal) {
        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        Long managerId = booking.getRoom()
                .getHotelBranch()
                .getHotel()
                .getManager()
                .getId();

        if (!managerId.equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }

    private void validateBookingRequest(BookingRequest request, Room room) {
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }

        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }

        if (request.getAdults() == null || request.getAdults() <= 0) {
            throw new AppException(ErrorCode.INVALID_NUMBER_OF_GUESTS);
        }

        int children = request.getChildren() == null ? 0 : request.getChildren();

        if (request.getAdults() > room.getMaxAdults()) {
            throw new AppException(ErrorCode.EXCEED_MAX_ADULTS);
        }

        if (children > room.getMaxChildren()) {
            throw new AppException(ErrorCode.EXCEED_MAX_CHILDREN);
        }

        if (request.getAdults() + children > room.getCapacity()) {
            throw new AppException(ErrorCode.EXCEED_ROOM_CAPACITY);
        }
    }

    private String generateBookingCode() {
        return "BK" + System.currentTimeMillis();
    }

    private UserVoucher validateVoucher(
            Long userVoucherId,
            User user,
            Room room) {
        UserVoucher userVoucher = userVoucherRepo.findById(userVoucherId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_VOUCHER_NOT_FOUND.getMessage()));

        if (!userVoucher.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (room.getIsVoucherApplicable() != null && !room.getIsVoucherApplicable()) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPLICABLE_FOR_ROOM);
        }

        if (userVoucher.getStatus() != UserVoucherStatus.UNUSED) {
            throw new AppException(ErrorCode.USER_VOUCHER_INVALID);
        }

        Voucher voucher = userVoucher.getVoucher();

        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            throw new AppException(ErrorCode.VOUCHER_NOT_ACTIVE);
        }

        if (voucher.getApprovalStatus() != ApprovalStatus.CONFIRMED) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPROVED);
        }

        LocalDateTime now = LocalDateTime.now();

        if (voucher.getStartDate() != null && now.isBefore(voucher.getStartDate())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_STARTED);
        }

        if (voucher.getExpiryDate() != null && now.isAfter(voucher.getExpiryDate())) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }

        if (voucher.getHotelBranch() != null
                && !Boolean.TRUE.equals(voucher.getIsWelcomeVoucher())
                && !voucher.getHotelBranch().getId()
                        .equals(room.getHotelBranch().getId())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPLICABLE_FOR_BRANCH);
        }

        if (voucher.getTotalUsageLimit() != null
                && voucher.getCurrentUsageCount() >= voucher.getTotalUsageLimit()) {
            throw new AppException(ErrorCode.VOUCHER_USAGE_LIMIT_EXCEEDED);
        }

        if (voucher.getUsageLimitPerUser() != null
                && userVoucher.getUsedCount() >= voucher.getUsageLimitPerUser()) {
            throw new AppException(ErrorCode.USER_VOUCHER_USAGE_LIMIT_EXCEEDED);
        }

        return userVoucher;
    }

    private BigDecimal calculateDiscount(
            BigDecimal originalPrice,
            Voucher voucher) {
        if (voucher.getMinOrderValue() != null
                && originalPrice.compareTo(voucher.getMinOrderValue()) < 0) {
            throw new AppException(ErrorCode.MIN_ORDER_NOT_REACHED);
        }

        BigDecimal discountAmount;

        if (voucher.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = originalPrice
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discountAmount = voucher.getDiscountValue();
        }

        if (voucher.getMaxDiscountAmount() != null
                && discountAmount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
            discountAmount = voucher.getMaxDiscountAmount();
        }

        if (discountAmount.compareTo(originalPrice) > 0) {
            discountAmount = originalPrice;
        }

        return discountAmount;
    }

    private BookingHistoryResponse convertToHistoryResponse(
            Booking booking) {
        Room room = booking.getRoom();

        String roomImage = room.getImages()
                .stream()
                .filter(image -> image.getStatus() == ImageStatus.CONFIRMED
                        && Boolean.TRUE.equals(image.getIsPrimary()))
                .map(RoomImage::getImageUrl)
                .findFirst()
                .orElse(null);

        Payment latestPayment = booking.getPayments() != null
                ? booking.getPayments()
                        .stream()
                        .max(Comparator.comparing(Payment::getCreatedAt))
                        .orElse(null)
                : null;

        return BookingHistoryResponse.builder()
                .bookingId(booking.getId())
                .bookingCode(booking.getBookingCode())
                .roomId(room.getId())
                .roomName(room.getRoomName())
                .imageUrl(roomImage)
                .hotelName(
                        room.getHotelBranch()
                                .getHotel()
                                .getName())
                .hotelBranchName(
                        room.getHotelBranch()
                                .getBranchName())
                .checkInDate(booking.getCheckInDate())
                .checkOutDate(booking.getCheckOutDate())
                .adults(booking.getAdults())
                .children(booking.getChildren())
                .finalPrice(booking.getFinalPrice())
                .status(booking.getStatus())
                .createdAt(booking.getCreatedAt())
                .paymentMethod(latestPayment != null && latestPayment.getPaymentMethod() != null ? latestPayment.getPaymentMethod().name() : null)
                .paymentUrl(latestPayment != null ? latestPayment.getPaymentUrl() : null)
                .build();
    }
}
