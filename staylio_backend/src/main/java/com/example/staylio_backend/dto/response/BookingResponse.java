package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingResponse {

    private Long id;

    private String bookingCode;

    private BookingStatus status;

    private String note;

    private String preferences;

    private Long userId;

    private String customerName;

    private String customerEmail;

    private String customerPhone;

    private Long roomId;

    private String roomName;

    private String roomNumber;

    private String roomImage;

    private Long hotelBranchId;

    private String hotelBranchName;

    private String hotelName;

    private LocalDate checkInDate;

    private LocalDate checkOutDate;

    private Integer totalNights;

    private Integer adults;

    private Integer children;

    private BigDecimal originalPrice;

    private BigDecimal discountAmount;

    private BigDecimal finalPrice;

    private Long voucherId;

    private String voucherCode;

    private String voucherTitle;

    private PaymentStatus paymentStatus;

    private PaymentMethod paymentMethod;

    private String transactionId;

    private String paymentUrl;

    private LocalDateTime paidAt;

    private LocalDateTime confirmedAt;

    private LocalDateTime cancelledAt;

    private LocalDateTime checkedInAt;

    private LocalDateTime checkedOutAt;

    private LocalDateTime createdAt;
}
