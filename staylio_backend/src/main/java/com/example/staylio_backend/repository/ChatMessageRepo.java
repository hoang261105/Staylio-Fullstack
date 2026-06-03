package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepo extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllBySession_IdOrderByCreatedAtAsc(Long sessionId);

    Optional<ChatMessage> findFirstBySession_IdOrderByCreatedAtDesc(Long sessionId);
}
