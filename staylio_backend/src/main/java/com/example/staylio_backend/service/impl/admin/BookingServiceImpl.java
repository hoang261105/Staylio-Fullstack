package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BookingFilterRequest;
import com.example.staylio_backend.dto.request.BookingStatusRequest;
import com.example.staylio_backend.dto.response.BookingResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.*;
import com.example.staylio_backend.repository.*;
import com.example.staylio_backend.service.BookingService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BookingServiceImpl implements BookingService {
    private final BookingRepo bookingRepo;
    private final ProfileRepo profileRepo;

    @Override
    public PaginationResponse<BookingResponse> getAllBookings(
            BookingFilterRequest request,
            UserPrincipal principal
    ) {
        int page = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(
                page,
                request.getSize(),
                getSort(request.getSortBy(), request.getDirection())
        );

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
                    pageable
            );
        } else if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

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
                    pageable
            );
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
                bookingsPage.getTotalElements()
        );

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public BookingResponse getBookingById(Long id, UserPrincipal principal) {
        Booking booking = bookingRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.BOOKING_NOT_FOUND.getMessage()));

        if (principal.getRoleName() == RoleName.ROLE_MANAGER){
            validateManagerOwnership(booking, principal);
        }
        return convertToResponse(booking);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, BookingStatusRequest request, UserPrincipal principal) {
        Booking booking = bookingRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.BOOKING_NOT_FOUND.getMessage()
                ));

        Payment payment = booking.getPayments()
                .stream()
                .max(Comparator.comparing(Payment::getCreatedAt))
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thanh toán!"));

        if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            validateManagerOwnership(booking, principal);
            updateByManager(booking, payment, request.getStatus(), request.getCancellationReason());
            return;
        }

        if (principal.hasRole(RoleName.ROLE_ADMIN)) {
            updateByAdmin(booking, payment, request.getStatus(), request.getCancellationReason());
            return;
        }

        throw new AppException(ErrorCode.UNAUTHORIZED);
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
                  .findFirst()
                  .orElse(null)
                : null;

        Voucher voucher = booking.getUserVoucher() != null
                ? booking.getUserVoucher().getVoucher()
                : null;

        String roomImage = booking.getRoom().getImages()
                .stream()
                .filter(image ->
                        image.getStatus() == ImageStatus.CONFIRMED
                                && Boolean.TRUE.equals(image.getIsPrimary())
                )
                .map(RoomImage::getImageUrl)
                .findFirst()
                .orElse(null);

        long totalNights = ChronoUnit.DAYS.between(
                booking.getCheckInDate(),
                booking.getCheckOutDate()
        );

        return new BookingResponse(
                booking.getId(),
                booking.getBookingCode(),
                booking.getStatus(),
                booking.getNote(),

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
                latestPayment != null ? latestPayment.getPaidAt() : null,

                booking.getConfirmedAt(),
                booking.getCancelledAt(),
                booking.getCheckedInAt(),
                booking.getCheckedOutAt(),
                booking.getCreatedAt()
        );
    }

    private void updateByManager(
            Booking booking,
            Payment payment,
            BookingStatus newStatus,
            String cancellationReason
    ) {
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
                    booking.getCheckOutDate().atTime(12, 0)
            );

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
            String cancellationReason
    ) {
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

    private void validateManagerOwnership(Booking booking, UserPrincipal principal) {
        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        Long managerId = booking.getRoom()
                .getHotelBranch()
                .getHotel()
                .getManager()
                .getId();

        if (!managerId.equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }
    }
}
