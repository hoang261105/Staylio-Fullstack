package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.NotificationType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class NotificationRequest {
    private Long senderId;

    private Long receiverId;

    private String title;

    private String content;

    private NotificationType type;

    private Long referenceId;
}
