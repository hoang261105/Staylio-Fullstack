package com.example.staylio_backend.controller;

import com.cloudinary.Api;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ApprovalStatusRequest;
import com.example.staylio_backend.dto.request.VoucherRequest;
import com.example.staylio_backend.dto.request.VoucherStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.VoucherResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.model.enums.VoucherStatus;
import com.example.staylio_backend.service.VoucherService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/vouchers")
@RequiredArgsConstructor
public class VoucherController {
    private final VoucherService voucherService;

    @GetMapping
    @Operation(summary = "Lấy danh sách voucher")
    public ResponseEntity<ApiResponse<PaginationResponse<VoucherResponse>>> getAllVouchers(
            @RequestParam(required = false) Long hotelBranchId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) VoucherStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        ApiResponse<PaginationResponse<VoucherResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách mã giảm giá thành công!",
                voucherService.getAllVouchers(search, hotelBranchId, page - 1, size, status, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 voucher")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<VoucherResponse>> getVoucherById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        ApiResponse<VoucherResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết voucher thành công",
                voucherService.getVoucherById(id, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Thêm mới 1 voucher")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<VoucherResponse>> createVoucher(
            @Valid @RequestBody VoucherRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        ApiResponse<VoucherResponse> response = new ApiResponse<>(
                true,
                "Thêm mới voucher thành công!",
                voucherService.createVoucher(request, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin voucher")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<VoucherResponse>> updateVoucher(
            @PathVariable Long id,
            @Valid @RequestBody VoucherRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        ApiResponse<VoucherResponse> response = new ApiResponse<>(
                true,
                "Cập nhật voucher thành công!",
                voucherService.updateVoucher(id, request, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái của voucher")
    @PreAuthorize("hasAnyRole('MANAGER', 'ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @RequestBody VoucherStatusRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        voucherService.updateStatus(id, request, userPrincipal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/approval-status")
    @Operation(summary = "Cập nhật trạng thái duyệt của voucher")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateApprovalStatus(
            @PathVariable Long id,
            @RequestBody ApprovalStatusRequest request
    ){
        voucherService.updateApprovalStatus(id, request);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái voucher thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
