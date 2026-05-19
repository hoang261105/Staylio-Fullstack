package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "payments")
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Builder
public class Payment extends BaseObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @Enumerated(EnumType.STRING)
    private PaymentMethod paymentMethod;

    private String transactionId;

    private String gatewayOrderId;

    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status;

    @Column(columnDefinition = "TEXT")
    private String paymentUrl;

    @Column(columnDefinition = "TEXT")
    private String rawResponse;

    private LocalDateTime paidAt;
}
