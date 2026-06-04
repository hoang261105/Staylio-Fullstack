package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.BranchStatus;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class HotelBranchResponse {
    private Long id;
    private Long provinceId;
    private Long wardId;
    private String hotelBranchName;
    private String address;
    private String imageUrl;
    private String wardName;
    private String provinceName;
    private Long hotelId;
    private String hotelName;
    private String description;
    private String phone;
    private Integer capacity;
    private BranchStatus status;
    private Long countReview;
    private Double averageRating;
    private Double latitude;
    private Double longitude;
    private String managerName;
}
