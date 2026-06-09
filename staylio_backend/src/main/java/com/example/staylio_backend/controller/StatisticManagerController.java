package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.ManagerDashboardStatsResponse;
import com.example.staylio_backend.service.StatisticManagerService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/statistic-manager")
@RequiredArgsConstructor
public class StatisticManagerController {
    private final StatisticManagerService statisticManagerService;

    @GetMapping("/dashboard/stats")
    @Operation(summary = "Thống kê của quản lý")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ManagerDashboardStatsResponse>> getDashboardStats(@AuthenticationPrincipal UserPrincipal principal) {
        ApiResponse<ManagerDashboardStatsResponse> response = new ApiResponse<>(
                true,
                "Lấy số lượng phòng thành công!",
                statisticManagerService.getManagerDashboardStats(principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
