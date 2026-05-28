package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PaymentResponse {
    private Long id;

    private Long bookingId;

    private String bookingCode;

    private PaymentMethod paymentMethod;

    private BigDecimal amount;

    private PaymentStatus status;

    private LocalDateTime paidAt;

    private LocalDateTime createdAt;
}
