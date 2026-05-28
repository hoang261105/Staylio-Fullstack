package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.MessageSenderType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_messages")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ChatMessage extends BaseObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "session_id")
    private ChatSession session;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id")
    private Profile sender;

    @Enumerated(EnumType.STRING)
    private MessageSenderType senderType;

    @Column(columnDefinition = "TEXT")
    private String content;

    private Boolean isRead;
}
