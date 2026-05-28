package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.MessageSenderType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageResponse {
    private Long id;

    private Long sessionId;

    private Long senderId;

    private String senderName;

    private String senderAvatar;

    private MessageSenderType senderType;

    private String content;

    private Boolean isRead;

    private LocalDateTime createdAt;
}
