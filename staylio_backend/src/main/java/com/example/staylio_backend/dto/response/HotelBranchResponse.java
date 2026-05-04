package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.BranchStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HotelBranchResponse {
    private String hotelBranchName;
    private String address;
    private String imageUrl;
    private String wardName;
    private String provinceName;
    private String hotelName;
    private BranchStatus status;
}
