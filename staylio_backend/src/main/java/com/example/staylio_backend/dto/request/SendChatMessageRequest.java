package com.example.staylio_backend.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendChatMessageRequest {
    private Long sessionId;
    private String content;
}
