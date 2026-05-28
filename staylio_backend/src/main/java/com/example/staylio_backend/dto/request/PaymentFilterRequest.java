package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class PaymentFilterRequest {
    private String search;

    private PaymentStatus status;
    private PaymentMethod paymentMethod;

    private Long hotelBranchId;

    private LocalDateTime paidFrom;
    private LocalDateTime paidTo;

    private LocalDateTime createdFrom;
    private LocalDateTime createdTo;

    private BigDecimal minAmount;
    private BigDecimal maxAmount;

    private Integer page = 1;
    private Integer size = 10;
    private String sortBy = "createdAt";
    private String direction = "desc";
}
