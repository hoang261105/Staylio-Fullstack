package com.example.staylio_backend.controller;

import com.cloudinary.Api;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomRequest;
import com.example.staylio_backend.dto.request.RoomStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.RoomResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.service.RoomService;
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
@RequestMapping("/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @GetMapping
    @Operation(summary = "Lấy danh sách phòng của chi nhánh")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PaginationResponse<RoomResponse>>> getAllRooms(
            @RequestParam(required = false) Long hotelBranchId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) RoomStatus status,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        ApiResponse<PaginationResponse<RoomResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách phòng thành công!",
                roomService.getAllRooms(search, hotelBranchId, page - 1, size, status, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 phòng thuộc chi nhánh của quản lý")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<RoomResponse>> getRoomById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        ApiResponse<RoomResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết phòng thành công!",
                roomService.getRoomById(id, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Thêm mới 1 phòng")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<RoomResponse>> createRoom(
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ApiResponse<RoomResponse> response = new ApiResponse<>(
                true,
                "Thêm mới 1 phòng thành công!",
                roomService.createRoom(request, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin phòng")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<RoomResponse>> updateRoom(
            @PathVariable Long id,
            @Valid @RequestBody RoomRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        ApiResponse<RoomResponse> response = new ApiResponse<>(
                true,
                "Cập nhật thông tin phòng thành công!",
                roomService.updateRoom(id, request, userPrincipal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái phòng")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @RequestBody RoomStatusRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        roomService.updateStatus(id, request, userPrincipal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/update-active")
    @Operation(summary = "Cập nhật trạng thái hoạt động của phòng")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateActive(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        roomService.updateActive(id, userPrincipal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái hoạt động thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/update-voucher")
    @Operation(summary = "Cập nhật trạng thái áp dụng voucher của phòng")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateVoucherActive(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        roomService.updateVoucher(id, userPrincipal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái áp dụng voucher thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
