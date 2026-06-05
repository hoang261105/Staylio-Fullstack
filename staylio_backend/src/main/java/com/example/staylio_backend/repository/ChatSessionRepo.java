package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.ChatSession;
import com.example.staylio_backend.model.enums.ChatSessionStatus;
import com.example.staylio_backend.model.enums.ChatSessionType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ChatSessionRepo extends JpaRepository<ChatSession, Long> {
    Optional<ChatSession> findFirstByUser_IdAndTypeAndStatus(
            Long userId,
            ChatSessionType type,
            ChatSessionStatus status
    );

    @Query("""
        SELECT cs
        FROM ChatSession cs
        WHERE cs.user.id = :customerId
          AND cs.manager.id = :managerId
          AND cs.type = 'MANAGER'
          AND cs.status = 'OPEN'
    """)
    Optional<ChatSession> findOpenManagerSession(
            @Param("customerId") Long customerId,
            @Param("managerId") Long managerId
    );

    @Query("""
        SELECT cs
        FROM ChatSession cs
        WHERE cs.user.id = :customerId
          AND cs.type = 'MANAGER'
        ORDER BY cs.createdAt DESC
    """)
    Page<ChatSession> findCustomerManagerSessions(
            @Param("customerId") Long customerId,
            Pageable pageable
    );

    @Query("""
        SELECT cs
        FROM ChatSession cs
        WHERE cs.manager.id = :managerId
          AND cs.type = 'MANAGER'
        ORDER BY cs.createdAt DESC
    """)
    Page<ChatSession> findManagerSessions(
            @Param("managerId") Long managerId,
            Pageable pageable
    );
}
