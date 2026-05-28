package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.HotelStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HotelResponse {
    private Long id;
    private String name;
    private String description;
    private String imageUrl;
    private HotelStatus status;
    private String hostHotelName;
    private boolean isActive;
    private Integer branchCount;
}
