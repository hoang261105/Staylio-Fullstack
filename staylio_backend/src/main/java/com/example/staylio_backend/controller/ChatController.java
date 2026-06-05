package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ChatSessionRequest;
import com.example.staylio_backend.dto.request.SendChatMessageRequest;
import com.example.staylio_backend.dto.request.StartManagerChatRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.ChatMessageResponse;
import com.example.staylio_backend.dto.response.ChatSessionResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.ChatSessionService;
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
@RequestMapping("/chat")
@RequiredArgsConstructor
public class ChatController {
    private final ChatSessionService chatSessionService;

    @PostMapping("/ai/session")
    @Operation(summary = "Tạo phiên chat với AI")
    public ResponseEntity<ApiResponse<ChatSessionResponse>> createAiSession(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<ChatSessionResponse> response = new ApiResponse<>(
                true,
                "Lấy phiên chat AI thành công!",
                chatSessionService.createOrGetAiSession(principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/ai/{sessionId}/messages")
    @Operation(summary = "Gửi tin nhắn cho AI")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendAiMessage(
            @PathVariable Long sessionId,
            @Valid @RequestBody ChatSessionRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<ChatMessageResponse> response = new ApiResponse<>(
                true,
                "Gửi tin nhắn thành công!",
                chatSessionService.sendMessage(sessionId, request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping("/sessions/{sessionId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getMessages(
            @PathVariable Long sessionId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<List<ChatMessageResponse>> response = new ApiResponse<>(
                true,
                "Lấy lịch sử chat thành công!",
                chatSessionService.getMessages(sessionId, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/manager/start")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ChatSessionResponse>> startChatWithManager(
            @RequestBody StartManagerChatRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Tạo phiên chat với quản lý thành công!",
                        chatSessionService.startChatWithManager(request, principal),
                        null,
                        LocalDateTime.now()
                )
        );
    }

    @PostMapping("/manager/messages")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> sendMessageToManager(
            @RequestBody SendChatMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Gửi tin nhắn thành công!",
                        chatSessionService.sendMessageToManager(request, principal),
                        null,
                        LocalDateTime.now()
                )
        );
    }

    @PostMapping("/manager/reply")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<ChatMessageResponse>> managerReply(
            @RequestBody SendChatMessageRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        return ResponseEntity.ok(
                new ApiResponse<>(
                        true,
                        "Phản hồi tin nhắn thành công!",
                        chatSessionService.managerReply(request, principal),
                        null,
                        LocalDateTime.now()
                )
        );
    }

    @GetMapping("/manager")
    @PreAuthorize("hasAnyRole('CUSTOMER', 'MANAGER')")
    public ResponseEntity<ApiResponse<PaginationResponse<ChatSessionResponse>>> getMyManagerSessions(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<PaginationResponse<ChatSessionResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách phiên chat thành công!",
                chatSessionService.getMyManagerSessions(page, size, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
