package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.NotificationType;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NotificationResponse {

    private Long id;

    // SENDER
    private Long senderId;
    private String senderName;
    private String senderAvatar;

    // RECEIVER
    private Long receiverId;

    // CONTENT
    private String title;
    private String content;

    // TYPE
    private NotificationType type;

    // REFERENCE
    private Long referenceId;

    // STATUS
    private Boolean isRead;
    private LocalDateTime readAt;

    // TIME
    private LocalDateTime createdAt;
}