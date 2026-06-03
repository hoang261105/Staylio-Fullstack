package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RoomImageRequest {
    @NotEmpty(message = "Danh sách ảnh không được để trống")
    private List<String> imageUrls;
}
