package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookingFilterRequest {
    private String search;

    private BookingStatus status;

    private PaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;

    private Long hotelBranchId;

    private Long roomId;

    private Long userId;

    private LocalDate checkInFrom;

    private LocalDate checkInTo;

    private LocalDate checkOutFrom;

    private LocalDate checkOutTo;

    private Integer page = 0;

    private Integer size = 10;

    private String sortBy = "createdAt";

    private String direction = "desc";
}
