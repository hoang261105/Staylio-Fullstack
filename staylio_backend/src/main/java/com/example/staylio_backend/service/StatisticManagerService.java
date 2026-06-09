package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ManagerDashboardStatsResponse;

public interface StatisticManagerService {
    ManagerDashboardStatsResponse getManagerDashboardStats(UserPrincipal principal);
}
