package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.ImageStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomImageAdminResponse {
    private Long id;
    private String imageUrl;
    private Long roomId;
    private String roomName;
    private String roomNumber;
    private String ownerName;
    private String hotelBranchName;
    private ImageStatus status;
    private Boolean isPrimary;
    private LocalDateTime createdAt;
    private String rejectionReason;
}
