package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.ImageStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RoomImageResponse {
    private Long id;
    private String roomName;
    private String imageUrl;
    private Boolean isPrimary;
    private ImageStatus status;
}
