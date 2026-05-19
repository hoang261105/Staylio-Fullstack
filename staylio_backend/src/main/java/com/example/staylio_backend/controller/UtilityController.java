package com.example.staylio_backend.controller;

import com.example.staylio_backend.dto.request.UtilityRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.UtilityResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.UtilityService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import jdk.jshell.execution.Util;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/utilities")
@RequiredArgsConstructor
public class UtilityController {
    private final UtilityService utilityService;

    @GetMapping
    @Operation(summary = "Lấy danh sách các tiện ích")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginationResponse<UtilityResponse>>> getAllUtilities(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        ApiResponse<PaginationResponse<UtilityResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách tiện ích thành công!",
                utilityService.findAll(search, page - 1, size, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/list")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<List<UtilityResponse>>> getAllUtilitiesForManager(){
        ApiResponse<List<UtilityResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách thành công!",
                utilityService.getAllUtilities(),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 tiện ích")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UtilityResponse>> getUtilityById(
            @PathVariable Long id
    ){
        ApiResponse<UtilityResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết tiện ích thành công!",
                utilityService.findById(id),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Thêm mới 1 tiện ích")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UtilityResponse>> createUtility(
            @Valid @RequestBody UtilityRequest utilityRequest
    ){
        ApiResponse<UtilityResponse> response = new ApiResponse<>(
                true,
                "Thêm mới tiện ích thành công!",
                utilityService.create(utilityRequest),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Cập nhật thông tin 1 tiện ích")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UtilityResponse>> updateUtility(
            @PathVariable Long id,
            @Valid @RequestBody UtilityRequest utilityRequest
    ){
        ApiResponse<UtilityResponse> response = new ApiResponse<>(
                true,
                "Cập nhật thông tin tiện ích thành công!",
                utilityService.update(id, utilityRequest),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/active")
    @Operation(summary = "Cập nhật trạng thái")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateActive(
            @PathVariable Long id
    ){
        utilityService.updateActive(id);
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
