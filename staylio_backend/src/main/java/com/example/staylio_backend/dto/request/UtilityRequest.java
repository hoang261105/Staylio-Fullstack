package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UtilityRequest {
    @NotBlank(message = "Vui lòng nhập tên tiện ích!")
    private String title;

    @NotBlank(message = "Vui lòng nhập tên icon!")
    private String iconName;

    private String description;
}
