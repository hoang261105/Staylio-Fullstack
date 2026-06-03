package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.BookingStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class BookingHistoryResponse {
    private Long bookingId;

    private String bookingCode;

    private Long roomId;

    private String roomName;

    private String imageUrl;

    private String hotelName;

    private String hotelBranchName;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Integer adults;

    private Integer children;

    private BigDecimal finalPrice;

    private BookingStatus status;

    private LocalDateTime createdAt;
    
    private String paymentMethod;
    
    private String paymentUrl;
}
