package com.example.staylio_backend.service.impl.admin.helper;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.entity.Payment;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentStatus;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.repository.BookingRepo;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.service.NotificationService;
import com.example.staylio_backend.dto.request.NotificationRequest;
import com.example.staylio_backend.model.enums.NotificationType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class BookingStatusMachineService {

    private final BookingRepo bookingRepo;
    private final PaymentRepo paymentRepo;
    private final NotificationService notificationService;

    public void updateByManager(Booking booking, Payment payment, BookingStatus newStatus, String cancellationReason) {
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

            Profile managerProfile = booking.getRoom().getHotelBranch().getHotel().getManager();
            if (managerProfile != null && booking.getUser().getProfile() != null) {
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .senderId(managerProfile.getId())
                        .receiverId(booking.getUser().getProfile().getId())
                        .title("Check-in thành công")
                        .content("Kính chào " + booking.getUser().getProfile().getFullName()
                                + ", chúc bạn có một kỳ nghỉ tuyệt vời tại "
                                + booking.getRoom().getHotelBranch().getBranchName() + "!")
                        .type(NotificationType.BOOKING_CHECKED_IN)
                        .referenceId(booking.getId())
                        .build();

                notificationService.create(notificationRequest);
            }

            return;
        }

        if (current == BookingStatus.CHECKED_IN && newStatus == BookingStatus.CHECKED_OUT) {
            booking.setStatus(BookingStatus.CHECKED_OUT);
            booking.setCheckedOutAt(LocalDateTime.now());

            Profile managerProfile = booking.getRoom().getHotelBranch().getHotel().getManager();
            if (managerProfile != null && booking.getUser().getProfile() != null) {
                NotificationRequest notificationRequest = NotificationRequest.builder()
                        .senderId(managerProfile.getId())
                        .receiverId(booking.getUser().getProfile().getId())
                        .title("Check-out thành công")
                        .content("Cảm ơn " + booking.getUser().getProfile().getFullName()
                                + " đã sử dụng dịch vụ. Hẹn gặp lại bạn trong những chuyến đi tiếp theo!")
                        .type(NotificationType.BOOKING_CHECKED_OUT)
                        .referenceId(booking.getId())
                        .build();

                notificationService.create(notificationRequest);
            }

            return;
        }

        throw new AppException(ErrorCode.INVALID_BOOKING_STATUS);
    }

    public void updateByAdmin(Booking booking, Payment payment, BookingStatus newStatus, String cancellationReason) {
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

    public void updateByUser(Booking booking, Payment payment, BookingStatus newStatus, String cancellationReason, UserPrincipal principal) {
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
}
