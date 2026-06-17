package com.example.staylio_backend.controller;

import com.example.staylio_backend.dto.response.AdminDashboardStatsResponse;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.service.StatisticAdminService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import com.example.staylio_backend.dto.response.MonthlyRevenueResponse;
import com.example.staylio_backend.dto.response.WeeklyBookingResponse;
import java.util.List;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/statistic-admin")
@RequiredArgsConstructor
public class StatisticAdminController {

    private final StatisticAdminService statisticAdminService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Thống kê của quản trị viên")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<AdminDashboardStatsResponse>> getDashboardStats() {
        ApiResponse<AdminDashboardStatsResponse> response = new ApiResponse<>(
                true,
                "Lấy dữ liệu thống kê thành công!",
                statisticAdminService.getAdminDashboardStats(),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/dashboard/revenue")
    @Operation(summary = "Doanh thu theo tháng của năm")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<MonthlyRevenueResponse>>> getMonthlyRevenue(
            @RequestParam(name = "year", defaultValue = "2026") int year) {
        ApiResponse<List<MonthlyRevenueResponse>> response = new ApiResponse<>(
                true,
                "Lấy dữ liệu doanh thu thành công!",
                statisticAdminService.getMonthlyRevenue(year),
                null,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/dashboard/bookings/weekly")
    @Operation(summary = "Đặt phòng theo tuần")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<WeeklyBookingResponse>>> getWeeklyBookings() {
        ApiResponse<List<WeeklyBookingResponse>> response = new ApiResponse<>(
                true,
                "Lấy dữ liệu đặt phòng theo tuần thành công!",
                statisticAdminService.getWeeklyBookings(),
                null,
                LocalDateTime.now()
        );
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
