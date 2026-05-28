package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.common.utils.CustomDateDeserializer;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class BookingRequest {
    @NotNull(message = "Vui lòng nhập id phòng!")
    private Long roomId;

    @NotNull(message = "Vui lòng nhập ngày nhận phòng!")
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Future(message = "Ngày nhận phòng phải lớn hơn ngày hiện tại!")
    private LocalDate checkInDate;

    @NotNull(message = "Vui lòng nhập ngày trả phòng!")
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Future(message = "Ngày trả phòng phải lớn hơn ngày hiện tại!")
    private LocalDate checkOutDate;

    @NotNull(message = "Vui lòng nhập số người lớn!")
    private Integer adults;

    @NotNull(message = "Vui lòng nhập số trẻ em!")
    private Integer children;
    private Long userVoucherId;
    private String note;

    private PaymentMethod paymentMethod;
}
