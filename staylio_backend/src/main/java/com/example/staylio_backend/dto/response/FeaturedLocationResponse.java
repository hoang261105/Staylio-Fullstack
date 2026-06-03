package com.example.staylio_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@Builder
public class FeaturedLocationResponse {
    private Long provinceId;

    private String provinceName;

    private String imageUrl;

    private Long totalHotels;

    private Long totalBranches;
}
