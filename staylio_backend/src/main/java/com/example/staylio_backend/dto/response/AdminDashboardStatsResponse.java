package com.example.staylio_backend.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class AdminDashboardStatsResponse {
    private BigDecimal totalRevenue;
    private Long totalBrands;
    private Long activeCustomers;
    private Long totalBranches;
}
