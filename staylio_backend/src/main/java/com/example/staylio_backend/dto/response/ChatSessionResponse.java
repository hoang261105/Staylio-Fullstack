package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.ChatSessionStatus;
import com.example.staylio_backend.model.enums.ChatSessionType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatSessionResponse {
    private Long id;

    private ChatSessionType type;

    private ChatSessionStatus status;

    private String lastMessage;

    private LocalDateTime lastMessageAt;

    private Long unreadCount;

    private LocalDateTime createdAt;
}
