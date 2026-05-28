package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.model.enums.RoomType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@Builder
public class RoomSearchResponse {
    private Long roomId;

    private String roomName;

    private RoomType roomType;

    private List<String> images;

    private Long hotelId;

    private String hotelName;

    private Long hotelBranchId;

    private String hotelBranchName;

    private String address;

    private String provinceName;

    private Integer capacity;

    private Integer maxAdults;

    private Integer maxChildren;

    private BigDecimal price;

    private Double averageRating;

    private Long reviewCount;

    private RoomStatus status;
}
