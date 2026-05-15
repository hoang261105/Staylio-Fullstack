package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.RoomType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.Set;

@Getter
@Setter
public class RoomRequest {

    @NotBlank(message = "Tên phòng không được để trống")
    @Size(max = 100, message = "Tên phòng không được vượt quá 100 ký tự")
    private String roomName;

    @NotNull(message = "Loại phòng không được để trống")
    private RoomType roomType;

    @NotBlank(message = "Mô tả không được để trống")
    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;

    @NotNull(message = "Chi nhánh khách sạn không được để trống")
    @Positive(message = "ID chi nhánh phải lớn hơn 0")
    private Long hotelBranchId;

    @NotNull(message = "Số người lớn tối đa không được để trống")
    @Positive(message = "Số người lớn phải lớn hơn 0")
    private Integer maxAdults;

    @NotNull(message = "Số trẻ em tối đa không được để trống")
    @PositiveOrZero(message = "Số trẻ em phải lớn hơn hoặc bằng 0")
    private Integer maxChildren;

    @NotNull(message = "Sức chứa không được để trống")
    @Positive(message = "Sức chứa phải lớn hơn 0")
    private Integer capacity;

    @NotNull(message = "Giá người lớn không được để trống")
    @Positive(message = "Giá người lớn phải lớn hơn 0")
    private BigDecimal adultPrice;

    @NotNull(message = "Giá trẻ em không được để trống")
    @PositiveOrZero(message = "Giá trẻ em phải lớn hơn hoặc bằng 0")
    private BigDecimal childPrice;

    @NotBlank(message = "Thông tin giường không được để trống")
    @Size(max = 100, message = "Thông tin giường không được vượt quá 100 ký tự")
    private String bedInfo;

    @NotNull(message = "Diện tích không được để trống")
    @Positive(message = "Diện tích phải lớn hơn 0")
    private Double area;

    @NotBlank(message = "Số phòng không được để trống")
    @Size(max = 20, message = "Số phòng không được vượt quá 20 ký tự")
    private String roomNumber;

    @NotNull(message = "Tầng không được để trống")
    @PositiveOrZero(message = "Tầng phải lớn hơn hoặc bằng 0")
    private Integer floor;

    @NotEmpty(message = "Vui lòng chọn ít nhất một tiện ích")
    private Set<Long> utilityIds;
}