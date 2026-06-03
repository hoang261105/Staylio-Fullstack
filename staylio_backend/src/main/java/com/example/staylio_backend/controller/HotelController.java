package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BulkActiveRequest;
import com.example.staylio_backend.dto.request.HotelRequest;
import com.example.staylio_backend.dto.request.HotelStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.HotelResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.HotelService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/hotels")
@RequiredArgsConstructor
public class HotelController {
    private final HotelService hotelService;

    @GetMapping
    @Operation(summary = "Danh sách thương hiệu khách sạn")
    public ResponseEntity<ApiResponse<PaginationResponse<HotelResponse>>> getAllHotels(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        ApiResponse<PaginationResponse<HotelResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách thương hiệu thành công!",
                hotelService.findAll(search, page - 1, size, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/lists")
    @Operation(summary = "Danh sách thương hiệu khách sạn không phân trang")
    public ResponseEntity<ApiResponse<List<HotelResponse>>> getAllHotelsLists() {
        ApiResponse<List<HotelResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách thương hiệu không phân trang thành công",
                hotelService.getAllHotels(),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 thương hiệu khách sạn")
    public ResponseEntity<ApiResponse<HotelResponse>> getHotelById(
            @PathVariable Long id
    ) {
        ApiResponse<HotelResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết thương hiệu khách sạn thành công!",
                hotelService.findById(id),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/my-hotel")
    @Operation(summary = "Lấy thương hiệu khách sạn của quản lí")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<HotelResponse>> getMyHotel(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ApiResponse<HotelResponse> response = new ApiResponse<>(
                true,
                "Lấy thương hiệu khách sạn của bạn thành công!",
                hotelService.getMyHotel(userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Thêm mới 1 thương hiệu khách sạn")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<HotelResponse>> createHotel(
        @Valid @RequestBody HotelRequest request,
        @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        ApiResponse<HotelResponse> response = new ApiResponse<>(
                true,
                "Tạo mới thương hiệu khách sạn thành công!",
                hotelService.addHotel(request, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thương hiệu khách sạn")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<HotelResponse>> updateHotel(
            @PathVariable Long id,
        @Valid @RequestBody HotelRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<HotelResponse> response = new ApiResponse<>(
                true,
                "Cập nhật thương hiệu khách sạn thành công!",
                hotelService.updateHotel(id, request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Duyệt thương hiệu khách sạn")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateHotelStatus(
            @PathVariable Long id,
            @RequestBody HotelStatusRequest request
    ) {
        hotelService.updateStatus(id, request.getStatus());
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Cập nhật trạng thái hoạt động")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateActive(
            @PathVariable Long id
    ){
        hotelService.updateActive(id);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái hoạt động thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/bulk-active")
    @Operation(summary = "Cập nhật trạng thái hoạt động cho nhiều thương hiệu")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateBulkActive(
            @RequestBody BulkActiveRequest request
    ) {
        hotelService.updateBulkActive(request.getIds(), request.getActive());

        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái nhiều thương hiệu thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
