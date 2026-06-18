package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.DiscountType;
import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
public class VoucherRequest {

    @NotBlank(message = "Mã voucher không được để trống")
    @Size(max = 50, message = "Mã voucher không được vượt quá 50 ký tự")
    @Pattern(
            regexp = "^[A-Z0-9_]+$",
            message = "Mã voucher chỉ được chứa chữ in hoa, số và dấu gạch dưới"
    )
    private String code;


    @NotBlank(message = "Tên voucher không được để trống")
    @Size(max = 100, message = "Tên voucher không được vượt quá 100 ký tự")
    private String title;


    @NotBlank(message = "Mô tả không được để trống")
    @Size(max = 500, message = "Mô tả không được vượt quá 500 ký tự")
    private String description;


    @NotNull(message = "Loại giảm giá không được để trống")
    private DiscountType discountType;


    @NotNull(message = "Giá trị giảm không được để trống")
    @DecimalMin(
            value = "0.01",
            message = "Giá trị giảm phải lớn hơn 0"
    )
    private BigDecimal discountValue;


    @NotNull(message = "Giá trị đơn tối thiểu không được để trống")
    @DecimalMin(
            value = "0.00",
            message = "Giá trị đơn tối thiểu không hợp lệ"
    )
    private BigDecimal minOrderValue;


    @DecimalMin(
            value = "0.00",
            message = "Giảm tối đa không hợp lệ"
    )
    private BigDecimal maxDiscountAmount;

    private Long hotelBranchId;

    private Boolean applyToAllBranches;


    @NotNull(message = "Tổng lượt sử dụng không được để trống")
    @Positive(message = "Tổng lượt sử dụng phải lớn hơn 0")
    private Integer totalUsageLimit;

    @NotNull(message = "Số lượt dùng mỗi người không được để trống")
    @Positive(message = "Số lượt dùng mỗi người phải lớn hơn 0")
    private Integer usageLimitPerUser;

    @NotNull(message = "Ngày bắt đầu không được để trống")
    @FutureOrPresent(message = "Ngày bắt đầu không hợp lệ")
    private LocalDateTime startDate;

    @NotNull(message = "Ngày hết hạn không được để trống")
    private LocalDateTime expiryDate;

    private Boolean isWelcomeVoucher = false;
}