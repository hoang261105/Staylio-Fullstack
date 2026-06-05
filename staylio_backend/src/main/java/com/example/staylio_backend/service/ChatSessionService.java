package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ChatSessionRequest;
import com.example.staylio_backend.dto.request.SendChatMessageRequest;
import com.example.staylio_backend.dto.request.StartManagerChatRequest;
import com.example.staylio_backend.dto.response.ChatMessageResponse;
import com.example.staylio_backend.dto.response.ChatSessionResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

import java.util.List;

public interface ChatSessionService {
    ChatSessionResponse createOrGetAiSession(UserPrincipal principal);

    ChatMessageResponse sendMessage(Long sessionId, ChatSessionRequest request, UserPrincipal principal);

    List<ChatMessageResponse> getMessages(
            Long sessionId,
            UserPrincipal principal
    );

    ChatSessionResponse startChatWithManager(
            StartManagerChatRequest request,
            UserPrincipal principal
    );

    ChatMessageResponse sendMessageToManager(
            SendChatMessageRequest request,
            UserPrincipal principal
    );

    ChatMessageResponse managerReply(
            SendChatMessageRequest request,
            UserPrincipal principal
    );

    PaginationResponse<ChatSessionResponse> getMyManagerSessions(
            int page,
            int size,
            UserPrincipal principal
    );

    PaginationResponse<ChatSessionResponse> getManagerSessionsByBranch(
            Long branchId,
            int page,
            int size,
            UserPrincipal principal
    );
}
