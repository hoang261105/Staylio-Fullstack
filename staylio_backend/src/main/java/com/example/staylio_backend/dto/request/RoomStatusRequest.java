package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.RoomStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoomStatusRequest {
    private RoomStatus status;
}
