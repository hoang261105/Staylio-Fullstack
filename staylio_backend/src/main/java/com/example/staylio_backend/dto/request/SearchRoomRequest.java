package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.RoomStatus;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
public class SearchRoomRequest {
    private String keyword;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Integer adults;
    private Integer children;
    private Integer capacity;
    private RoomStatus status;
    private BigDecimal minPrice;
    private BigDecimal maxPrice;

    private Double minRating;
    private Long provinceId;
    private Long wardId;
    private int page;
    private int size;
    private String sortBy;
    private String direction;
}
