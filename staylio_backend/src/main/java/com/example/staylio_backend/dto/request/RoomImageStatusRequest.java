package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.ImageStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomImageStatusRequest {
    @NotNull(message = "Vui lòng nhập trạng thái!")
    private ImageStatus status;
    private String rejectionReason;
}
