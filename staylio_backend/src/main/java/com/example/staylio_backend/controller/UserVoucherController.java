package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.ApplicableVoucherResponse;
import com.example.staylio_backend.service.UserVoucherService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/user-vouchers")
@RequiredArgsConstructor
public class UserVoucherController {
    private final UserVoucherService userVoucherService;

    @GetMapping("/applicable")
    @Operation(summary = "Lấy danh sách các voucher đủ điều kiện để áp phòng của tài khoản user")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<List<ApplicableVoucherResponse>>> getApplicableVouchers(
            @RequestParam Long roomId,
            @RequestParam(required = false) LocalDate checkInDate,
            @RequestParam(required = false) LocalDate checkOutDate,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<List<ApplicableVoucherResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách voucher áp dụng thành công!",
                userVoucherService.getApplicableVouchers(roomId, checkInDate, checkOutDate, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
