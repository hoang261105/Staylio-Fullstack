package com.example.staylio_backend.dto.response;

import lombok.*;

import java.math.BigDecimal;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ManagerDashboardStatsResponse {
    private Long totalRooms;

    private Long stayingGuests;

    private Long newBookings;

    private BigDecimal estimatedRevenue;

    private Integer roomGrowth;
    private Double guestGrowthPercent;
    private Double bookingGrowthPercent;
    private Double revenueGrowthPercent;
}
