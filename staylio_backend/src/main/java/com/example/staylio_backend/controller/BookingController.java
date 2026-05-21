package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BookingFilterRequest;
import com.example.staylio_backend.dto.request.BookingStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.BookingResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/bookings")
@RequiredArgsConstructor
public class BookingController {
    private final BookingService bookingService;

    @GetMapping
    @Operation(summary = "Lấy danh sách đơn đặt phòng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PaginationResponse<BookingResponse>>> getAllBookings(
            @ParameterObject BookingFilterRequest request,
            @AuthenticationPrincipal UserPrincipal principal
            ){
        ApiResponse<PaginationResponse<BookingResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách đơn đặt phòng thành công!",
                bookingService.getAllBookings(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 đơn đặt phòng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<BookingResponse>> getBookingById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<BookingResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết đơn đặt phòng thành công!",
                bookingService.getBookingById(id, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đơn đặt phòng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @RequestBody BookingStatusRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        bookingService.updateStatus(id, request, principal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái thành công",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
