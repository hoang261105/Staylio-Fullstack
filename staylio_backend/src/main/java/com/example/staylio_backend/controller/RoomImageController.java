package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomImageStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.RoomImageAdminResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.ImageStatus;
import com.example.staylio_backend.service.RoomImageService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/room-images")
@RequiredArgsConstructor
public class RoomImageController {
    private final RoomImageService roomImageService;

    @GetMapping
    @Operation(summary = "Danh sách hình ảnh phòng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<PaginationResponse<RoomImageAdminResponse>>> getAllImages(
            @RequestParam(required = false) Long roomId,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) ImageStatus status,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "4") int size
    ){
        ApiResponse<PaginationResponse<RoomImageAdminResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách ảnh phòng thành công!",
                roomImageService.getAllImages(search, roomId, status, page - 1, size, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Xem chi tiết hình ảnh phòng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<RoomImageAdminResponse>> getRoomImageById(
            @PathVariable Long id
    ){
        ApiResponse<RoomImageAdminResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết hình ảnh phòng thành công!",
                roomImageService.getRoomImageById(id),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái ảnh phòng")
    @PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @RequestBody RoomImageStatusRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
            ){
        roomImageService.updateStatus(id, request, userPrincipal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
