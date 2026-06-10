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
import org.springframework.web.bind.annotation.RestController;

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
}
