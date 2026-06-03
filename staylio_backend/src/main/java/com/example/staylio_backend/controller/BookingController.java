package com.example.staylio_backend.controller;

import com.cloudinary.Api;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BookingFilterRequest;
import com.example.staylio_backend.dto.request.BookingHistoryRequest;
import com.example.staylio_backend.dto.request.BookingRequest;
import com.example.staylio_backend.dto.request.BookingStatusRequest;
import com.example.staylio_backend.dto.response.*;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.BookingService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

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

    @PostMapping("/preview")
    public ResponseEntity<ApiResponse<BookingPreviewResponse>> previewBooking(
            @Valid @RequestBody BookingRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<BookingPreviewResponse> response = new ApiResponse<>(
                true,
                "Tính giá đặt phòng thành công!",
                bookingService.previewBooking(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ApiResponse<BookingResponse>> createBooking(
            @RequestBody @Valid BookingRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<BookingResponse> response = new ApiResponse<>(
                true,
                "Đặt phòng thành công!",
                bookingService.createBooking(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/room/{roomId}/booked-dates")
    @Operation(summary = "Lấy danh sách các ngày đã đặt của một phòng")
    public ResponseEntity<ApiResponse<List<DateRangeResponse>>> getBookedDates(@PathVariable Long roomId) {
        ApiResponse<List<DateRangeResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách ngày đã đặt thành công!",
                bookingService.getBookedDates(roomId),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/history")
    @Operation(summary = "Lịch sử đặt phòng")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<PaginationResponse<BookingHistoryResponse>>> getAllBookingsByUser(
            @ParameterObject BookingHistoryRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<PaginationResponse<BookingHistoryResponse>> response = new ApiResponse<>(
                true,
                "Lấy lịch sử đặt phòng thành công!",
                bookingService.getMyBookings(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
