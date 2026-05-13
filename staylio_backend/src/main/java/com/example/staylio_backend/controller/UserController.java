package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BulkStatusRequest;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.UserResponseDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.UserService;
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
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Danh sách khách hàng")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PaginationResponse<UserResponseDTO>>> getStudentList(
            @RequestParam(required = false) String search,
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "5") int size,
            @RequestParam(required = false) String sortBy,
            @RequestParam(required = false) String direction
    ) {
        ApiResponse<PaginationResponse<UserResponseDTO>> response = new ApiResponse<>(
                true,
                "Lấy danh sách khách hàng thành công!",
                userService.getStudentList(search, page - 1, size, sortBy, direction),
                null,
                LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết khách hàng")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDTO>> getUserById(@PathVariable Long id) {
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(
                userService.getUserById(id),
                "Lấy chi tiết khách hàng thành công!"
        ));
    }

    @PostMapping
    @Operation(summary = "Thêm 1 tài khoản mới")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<UserResponseDTO>> createUser(
            @Valid @RequestBody UserRegisterRequest userRegisterRequest
            ) {
        UserResponseDTO user = userService.createUser(userRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.success(
                user,
                "Tạo tài khoản thành công!"
        ));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Khóa tài khoản")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateUserStatus(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ){
        userService.updateStatus(id, userPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(
                null,
                "Cập nhật trạng thái thành công!"
        ));
    }

    @PatchMapping("/bulk-status")
    @Operation(summary = "Khóa nhiều tài khoản")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateBulkStatus(
            @RequestBody BulkStatusRequest request,
            @AuthenticationPrincipal UserPrincipal userPrincipal
            ) {
        userService.updateBulkStatus(request, userPrincipal);
        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(
                null,
                "Cập nhật trạng thái nhiều tài khoản thành công"
        ));
    }
}
