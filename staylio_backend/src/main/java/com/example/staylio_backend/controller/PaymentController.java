package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.PaymentFilterRequest;
import com.example.staylio_backend.dto.request.PaymentStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.PaymentResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.PaymentService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/payments")
@RequiredArgsConstructor
public class PaymentController {
    private final PaymentService paymentService;

    @GetMapping
    @Operation(summary = "Danh sách đơn thanh toán")
    public ResponseEntity<ApiResponse<PaginationResponse<PaymentResponse>>> getAllPayments(
            @ParameterObject PaymentFilterRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<PaginationResponse<PaymentResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách thanh toán thành công!",
                paymentService.getAllPayments(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái thanh toán")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<PaymentResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody PaymentStatusRequest request
    ){
        paymentService.updateStatus(id, request);

        ApiResponse<PaymentResponse> response = new ApiResponse<>(
                true,
                "Cập nhật thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/zalopay/callback")
    public ResponseEntity<Map<String, Object>> zaloPayCallback(
            @RequestBody Map<String, Object> body
    ) {
        return ResponseEntity.ok(
                paymentService.handleZaloPayCallback(body)
        );
    }
}
