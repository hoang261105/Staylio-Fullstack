package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.NotificationResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
public class NotificationController {
        private final NotificationService notificationService;

        @GetMapping
        @Operation(summary = "Lấy danh sách thông báo theo người nhận")
        public ResponseEntity<ApiResponse<PaginationResponse<NotificationResponse>>> getAllNotifications(
                        @RequestParam(defaultValue = "1") int page,
                        @RequestParam(defaultValue = "5") int size,
                        @AuthenticationPrincipal UserPrincipal principal) {
                ApiResponse<PaginationResponse<NotificationResponse>> response = new ApiResponse<>(
                                true,
                                "Lấy danh sách thông báo thành công!",
                                notificationService.getMyNotifications(page, size, principal),
                                null,
                                LocalDateTime.now());

                return new ResponseEntity<>(response, HttpStatus.OK);
        }

        @GetMapping("/me/unread-count")
        @Operation(summary = "Lấy số thông báo chưa đọc")
        public ResponseEntity<ApiResponse<Long>> countMyUnreadNotifications(
                        @AuthenticationPrincipal UserPrincipal principal) {

                ApiResponse<Long> response = new ApiResponse<>(
                                true,
                                "Lấy số thông báo chưa đọc thành công!",
                                notificationService.countMyUnreadNotifications(principal),
                                null,
                                LocalDateTime.now());

                return ResponseEntity.ok(response);
        }

        @PatchMapping("/{id}/read")
        @Operation(summary = "Đánh dấu thông báo đã đọc")
        public ResponseEntity<ApiResponse<Void>> markAsRead(
                        @PathVariable Long id,
                        @AuthenticationPrincipal UserPrincipal principal) {
                notificationService.markAsRead(id, principal);
                ApiResponse<Void> response = new ApiResponse<>(
                                true,
                                "Đánh dấu thông báo đã đọc thành công!",
                                null,
                                null,
                                LocalDateTime.now());
                return ResponseEntity.ok(response);
        }
}
