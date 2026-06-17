package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.response.AdminDashboardStatsResponse;

import java.util.List;
import com.example.staylio_backend.dto.response.MonthlyRevenueResponse;
import com.example.staylio_backend.dto.response.WeeklyBookingResponse;

public interface StatisticAdminService {
    AdminDashboardStatsResponse getAdminDashboardStats();
    List<MonthlyRevenueResponse> getMonthlyRevenue(int year);
    List<WeeklyBookingResponse> getWeeklyBookings();
}
