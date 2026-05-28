package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.ChatSessionStatus;
import com.example.staylio_backend.model.enums.ChatSessionType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "chat_sessions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ChatSession extends BaseObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private Profile user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Profile manager;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_branch_id")
    private HotelBranch hotelBranch;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id")
    private Room room;

    @Enumerated(EnumType.STRING)
    private ChatSessionType type;

    @Enumerated(EnumType.STRING)
    private ChatSessionStatus status;
}
