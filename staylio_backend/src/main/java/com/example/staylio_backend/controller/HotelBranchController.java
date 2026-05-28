package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BranchStatusRequest;
import com.example.staylio_backend.dto.request.HotelBranchRequest;
import com.example.staylio_backend.dto.request.HotelIdRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.service.HotelBranchService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/hotel-branches")
@RequiredArgsConstructor
public class HotelBranchController {
        private final HotelBranchService hotelBranchService;

        @GetMapping
        @Operation(summary = "Danh sách chi nhánh khách sạn")
        public ResponseEntity<ApiResponse<PaginationResponse<HotelBranchResponse>>> getHotelBranches(
                        @RequestParam(required = false) Long hotelId,
                        @RequestParam(required = false) String search,
                        @RequestParam(required = false) BranchStatus status,
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "5") int size,
                        @RequestParam(required = false) String sortBy,
                        @RequestParam(required = false) String direction) {
                ApiResponse<PaginationResponse<HotelBranchResponse>> response = new ApiResponse<>(
                                true,
                                "Lấy danh sách chi nhánh khách sạn thành công!",
                                hotelBranchService.getHotelBranches(hotelId, search, status, page - 1, size, sortBy,
                                                direction),
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/me")
        @Operation(summary = "Danh sách tất cả chi nhánh của tôi")
        public ResponseEntity<ApiResponse<List<HotelBranchResponse>>> getMyHotelBranches(
                @RequestParam Long hotelId,
                @RequestParam BranchStatus status,
                @AuthenticationPrincipal UserPrincipal userPrincipal
        ){
            ApiResponse<List<HotelBranchResponse>> response = new ApiResponse<>(
                    true,
                    "Lấy tất cả chi nhánh của tôi thành công!",
                    hotelBranchService.getAllBranchesByHotelId(hotelId, status, userPrincipal),
                    null,
                    LocalDateTime.now()
            );

            return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/{id}")
        @Operation(summary = "Lấy chi tiết 1 chi nhánh khách sạn")
        public ResponseEntity<ApiResponse<HotelBranchResponse>> getHotelBranchById(@PathVariable Long id,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
                ApiResponse<HotelBranchResponse> response = new ApiResponse<>(
                                true,
                                "Lấy chi tiết chi nhánh khách sạn thành công!",
                                hotelBranchService.getHotelBranchById(id, userPrincipal),
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PostMapping
        @Operation(summary = "Thêm mới 1 chi nhánh của thương hiệu khách sạn")
        @PreAuthorize("hasRole('MANAGER')")
        public ResponseEntity<ApiResponse<HotelBranchResponse>> addHotelBranch(
                        @Valid @RequestBody HotelBranchRequest request,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
                ApiResponse<HotelBranchResponse> response = new ApiResponse<>(
                                true,
                                "Thêm mới chi nhánh thành công!",
                                hotelBranchService.addBranch(userPrincipal, request),
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.CREATED);
        }

        @PutMapping("/{id}")
        @Operation(summary = "Cập nhật chi nhánh khách sạn")
        @PreAuthorize("hasRole('MANAGER')")
        public ResponseEntity<ApiResponse<HotelBranchResponse>> updateHotelBranch(
                        @PathVariable Long id,
                        @Valid @RequestBody HotelBranchRequest request,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
                ApiResponse<HotelBranchResponse> response = new ApiResponse<>(
                                true,
                                "Cập nhật chi nhánh thành công",
                                hotelBranchService.updateBranch(id, userPrincipal, request),
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PatchMapping("/{id}")
        @Operation(summary = "Xóa 1 chi nhánh khách sạn")
        @PreAuthorize("hasRole('MANAGER')")
        public ResponseEntity<ApiResponse<String>> deleteHotelBranch(
                        @PathVariable Long id,
                        @RequestBody HotelIdRequest request,
                        @AuthenticationPrincipal UserPrincipal userPrincipal) {
                hotelBranchService.deleteStatus(id, request, userPrincipal);
                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                "Xóa chi nhánh thành công!",
                                null,
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @PatchMapping("/{id}/status")
        @Operation(summary = "Cập nhật/Duyệt chi nhánh khách sạn")
        @PreAuthorize("hasRole('ADMIN')")
        public ResponseEntity<ApiResponse<String>> updateStatus(
                @PathVariable Long id,
                @RequestBody BranchStatusRequest request
        ) {
                hotelBranchService.updateStatus(id, request);
                ApiResponse<String> response = new ApiResponse<>(
                                true,
                                "Cập nhật/Duyệt chi nhánh khách sạn thành công!",
                                null,
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.OK);
        }
}
