package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface NotificationRepo extends JpaRepository<Notification, Long> {
    @Query("""
        SELECT n
        FROM Notification n
        WHERE n.receiver.id = :receiverId
          AND n.isDeleted = false
        ORDER BY n.createdAt DESC
    """)
    Page<Notification> findAllByReceiverId(
            @Param("receiverId") Long receiverId,
            Pageable pageable
    );

    Long countByReceiver_IdAndIsReadFalseAndIsDeletedFalse(Long receiverId);
}
