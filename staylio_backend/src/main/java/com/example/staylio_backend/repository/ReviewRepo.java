package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Review;
import com.example.staylio_backend.model.enums.ReviewStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReviewRepo extends JpaRepository<Review, Long> {
    @Query("""
        SELECT r
        FROM Review r
        JOIN r.booking b
        JOIN b.user u
        JOIN u.profile p
        JOIN b.room rm
        JOIN rm.hotelBranch hb
        WHERE (
            :search IS NULL
            OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(rm.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(rm.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
        )
    
        AND (:rating IS NULL OR r.rating = :rating)
    
        AND (:status IS NULL OR r.status = :status)
    
        AND (:hotelBranchId IS NULL OR hb.id = :hotelBranchId)
    
        AND (:roomId IS NULL OR rm.id = :roomId)
    
        AND (:userId IS NULL OR u.id = :userId)
    
        AND (:createdFrom IS NULL OR r.createdAt >= :createdFrom)
    
        AND (:createdTo IS NULL OR r.createdAt <= :createdTo)
    
        AND (
            :hasReply IS NULL
            OR (:hasReply = true AND r.replyComment IS NOT NULL)
            OR (:hasReply = false AND r.replyComment IS NULL)
        )
    """)
    Page<Review> searchReviews(
            @Param("search") String search,
            @Param("rating") Integer rating,
            @Param("status") ReviewStatus status,
            @Param("hotelBranchId") Long hotelBranchId,
            @Param("roomId") Long roomId,
            @Param("userId") Long userId,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            @Param("hasReply") Boolean hasReply,
            Pageable pageable
    );

    @Query("""
        SELECT r
        FROM Review r
        JOIN r.booking b
        JOIN b.user u
        JOIN u.profile p
        JOIN b.room rm
        JOIN rm.hotelBranch hb
        JOIN hb.hotel h
        WHERE h.manager.id = :managerId
    
        AND (
            :search IS NULL
            OR LOWER(p.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(rm.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(rm.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
        )
    
        AND (:rating IS NULL OR r.rating = :rating)
    
        AND (:status IS NULL OR r.status = :status)
    
        AND (:hotelBranchId IS NULL OR hb.id = :hotelBranchId)
    
        AND (:roomId IS NULL OR rm.id = :roomId)
    
        AND (:userId IS NULL OR u.id = :userId)
    
        AND (:createdFrom IS NULL OR r.createdAt >= :createdFrom)
    
        AND (:createdTo IS NULL OR r.createdAt <= :createdTo)
    
        AND (
            :hasReply IS NULL
            OR (:hasReply = true AND r.replyComment IS NOT NULL)
            OR (:hasReply = false AND r.replyComment IS NULL)
        )
    """)
    Page<Review> searchReviewsByManager(
            @Param("managerId") Long managerId,
            @Param("search") String search,
            @Param("rating") Integer rating,
            @Param("status") ReviewStatus status,
            @Param("hotelBranchId") Long hotelBranchId,
            @Param("roomId") Long roomId,
            @Param("userId") Long userId,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            @Param("hasReply") Boolean hasReply,
            Pageable pageable
    );

    @Query("""
        SELECT COUNT(r)
        FROM Review r
        JOIN r.room room
        JOIN room.hotelBranch branch
        WHERE branch.id = :branchId
          AND r.status = 'VISIBLE'
          AND r.isDeleted = false
    """)
    Long countReviewsByBranchId(@Param("branchId") Long branchId);

    @Query("""
        SELECT COALESCE(AVG(r.rating), 0)
        FROM Review r
        JOIN r.room room
        JOIN room.hotelBranch branch
        WHERE branch.id = :branchId
          AND r.status = 'VISIBLE'
          AND r.isDeleted = false
    """)
    Double averageRatingByBranchId(@Param("branchId") Long branchId);

    boolean existsByBooking_IdAndIsDeletedFalse(Long bookingId);
}
