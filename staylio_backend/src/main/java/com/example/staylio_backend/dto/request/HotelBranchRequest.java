package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelBranchRequest {
    @NotBlank(message = "Tên chi nhánh không được để trống!")
    @Size(min = 10, max = 100, message = "Tên chi nhánh phải từ 10 đến 100 ký tự!")
    private String branchName;

    @NotBlank(message = "Địa chỉ không được để trống!")
    private String address;

    @NotBlank(message = "Vui lòng nhập url hình ảnh")
    private String imageUrl;

    @NotNull(message = "Vui lòng nhập id xã/phường!")
    private Long wardId;

    @NotNull(message = "Vui lòng nhập id thương hiệu khách sạn!")
    private Long hotelId;

    private String description;

    @NotBlank(message = "Số điện thoại không được để trống!")
    @Pattern(
            regexp = "^(0|84)([35789])([0-9]{8})$",
            message = "Số điện thoại không hợp lệ!"
    )
    private String phone;

    @NotNull(message = "Vui lòng nhập sức chứa tối đa!")
    private Integer capacity;
}
