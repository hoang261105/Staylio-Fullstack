package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.ChatSession;
import com.example.staylio_backend.model.enums.ChatSessionStatus;
import com.example.staylio_backend.model.enums.ChatSessionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatSessionRepo extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findFirstByUser_IdAndTypeAndStatus(
            Long userId,
            ChatSessionType type,
            ChatSessionStatus status
    );
}
