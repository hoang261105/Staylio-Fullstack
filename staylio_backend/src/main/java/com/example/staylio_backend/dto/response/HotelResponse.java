package com.example.staylio_backend.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HotelResponse {
    private String name;
    private String description;
    private String imageUrl;
    private Boolean status;
    private String hostHotelName;
}
