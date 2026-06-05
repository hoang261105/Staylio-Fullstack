package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChatMessageRepo extends JpaRepository<ChatMessage, Long> {
    List<ChatMessage> findAllBySession_IdOrderByCreatedAtAsc(Long sessionId);

    Optional<ChatMessage> findFirstBySession_IdOrderByCreatedAtDesc(Long sessionId);

    @Query("""
        SELECT cm
        FROM ChatMessage cm
        WHERE cm.session.id = :sessionId
        ORDER BY cm.createdAt ASC
    """)
    List<ChatMessage> findMessagesBySessionId(
            @Param("sessionId") Long sessionId
    );
}
