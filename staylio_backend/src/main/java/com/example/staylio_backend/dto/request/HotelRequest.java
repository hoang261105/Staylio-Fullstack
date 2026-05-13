package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class HotelRequest {
    @NotBlank(message = "Tên thương hiệu khách sạn không được để trống!")
    private String name;

    @NotBlank(message = "Vui lòng nhập mô tả!")
    private String description;

    private String imageUrl;
}
