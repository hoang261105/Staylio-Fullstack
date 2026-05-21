package com.example.staylio_backend.service;

import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.repository.BookingRepo;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class BookingScheduler {

    private final BookingRepo bookingRepo;

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void autoCheckoutBookings() {

        LocalDateTime now = LocalDateTime.now();

        List<Booking> bookings =
                bookingRepo.findByStatusAndExpectedCheckOutAtIsNotNullAndExpectedCheckOutAtLessThanEqual(
                        BookingStatus.CHECKED_IN,
                        now
                );

        if (bookings.isEmpty()) {
            return;
        }

        for (Booking booking : bookings) {

            if (booking.getCheckedOutAt() != null) {
                continue;
            }

            booking.setStatus(BookingStatus.CHECKED_OUT);
            booking.setCheckedOutAt(now);
            booking.getRoom().setStatus(RoomStatus.AVAILABLE);
        }
    }
}
