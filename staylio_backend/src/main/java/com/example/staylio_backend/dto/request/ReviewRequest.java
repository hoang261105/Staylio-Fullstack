package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewRequest {
    @NotNull(message = "Vui lòng nhập mã đặt phòng!")
    private Long bookingId;

    @NotNull(message = "Vui lòng nhập id phòng!")
    private Long roomId;

    @NotNull(message = "Vui lòng nhập số sao!")
    private Integer rating;

    @NotBlank(message = "Vùi nhập nhập đánh giá!")
    private String comment;
}
