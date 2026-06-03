package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ChatSessionRequest;
import com.example.staylio_backend.dto.response.ChatMessageResponse;
import com.example.staylio_backend.dto.response.ChatSessionResponse;

import java.util.List;

public interface ChatSessionService {
    ChatSessionResponse createOrGetAiSession(UserPrincipal principal);

    ChatMessageResponse sendMessage(Long sessionId, ChatSessionRequest request, UserPrincipal principal);

    List<ChatMessageResponse> getMessages(
            Long sessionId,
            UserPrincipal principal
    );
}
