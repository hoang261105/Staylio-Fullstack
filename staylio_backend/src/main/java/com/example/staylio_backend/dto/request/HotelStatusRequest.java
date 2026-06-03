package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.HotelStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HotelStatusRequest {
    private HotelStatus status;
}
