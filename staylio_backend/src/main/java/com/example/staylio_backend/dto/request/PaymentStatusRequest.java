package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class PaymentStatusRequest {
    private PaymentStatus paymentStatus;
    private BookingStatus bookingStatus;
}
