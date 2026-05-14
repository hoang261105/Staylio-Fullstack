package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.model.enums.RoomType;
import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomResponse {
    private Long id;
    private Long hotelBranchId;
    private String roomName;
    private RoomType roomType;
    private String description;
    private String hotelBranchName;
    private BigDecimal price;
    private Integer maxAdults;
    private Integer maxChildren;
    private Integer capacity;
    private BigDecimal adultPrice;
    private BigDecimal childPrice;
    private String bedInfo;
    private Double area;
    private String roomNumber;
    private Integer floor;
    private RoomStatus status;
    private Boolean isActive;
    private Boolean isVoucherApplicable;
}
