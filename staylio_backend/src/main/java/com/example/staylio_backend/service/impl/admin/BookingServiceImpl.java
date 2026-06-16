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

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Set;

import com.example.staylio_backend.service.impl.admin.helper.BookingValidationService;
import com.example.staylio_backend.service.impl.admin.helper.BookingPricingService;
import com.example.staylio_backend.service.impl.admin.helper.BookingStatusMachineService;
import com.example.staylio_backend.service.impl.admin.helper.BookingPaymentDispatcher;

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
    private final TravelokaIntegrationService travelokaIntegrationService;
    private final BookingValidationService bookingValidationService;
    private final BookingPricingService bookingPricingService;
    private final BookingStatusMachineService bookingStatusMachineService;
    private final BookingPaymentDispatcher bookingPaymentDispatcher;

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
            bookingStatusMachineService.updateByManager(booking, payment, request.getStatus(),
                    request.getCancellationReason());
            return;
        }

        if (principal.hasRole(RoleName.ROLE_ADMIN)) {
            bookingStatusMachineService.updateByAdmin(booking, payment, request.getStatus(),
                    request.getCancellationReason());
            return;
        }

        if (principal.hasRole(RoleName.ROLE_CUSTOMER)) {
            bookingStatusMachineService.updateByUser(
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

        bookingValidationService.validateBookingRequest(request, room);

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
            UserVoucher userVoucher = bookingValidationService.validateVoucher(
                    request.getUserVoucherId(),
                    user,
                    room);

            discountAmount = bookingPricingService.calculateDiscount(
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

        bookingValidationService.validateBookingRequest(request, room);

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
            userVoucher = bookingValidationService.validateVoucher(
                    request.getUserVoucherId(),
                    user,
                    room);

            discountAmount = bookingPricingService.calculateDiscount(
                    originalPrice,
                    userVoucher.getVoucher());

            userVoucher.setStatus(UserVoucherStatus.USED);
            userVoucher.setUsedAt(LocalDateTime.now());
            userVoucher.setUsedCount(userVoucher.getUsedCount() == null ? 1 : userVoucher.getUsedCount() + 1);
            userVoucherRepo.save(userVoucher);

            Voucher voucher = userVoucher.getVoucher();
            voucher.setCurrentUsageCount(
                    voucher.getCurrentUsageCount() == null ? 1 : voucher.getCurrentUsageCount() + 1);
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

        bookingPaymentDispatcher.dispatchPayment(savedBooking, savedPayment, request.getPaymentMethod());

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
                .paymentMethod(latestPayment != null && latestPayment.getPaymentMethod() != null
                        ? latestPayment.getPaymentMethod().name()
                        : null)
                .paymentUrl(latestPayment != null ? latestPayment.getPaymentUrl() : null)
                .build();
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

    private String generateBookingCode() {
        return "BK" + System.currentTimeMillis();
    }
}
