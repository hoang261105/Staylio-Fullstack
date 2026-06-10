package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Payment;
import com.example.staylio_backend.model.enums.PaymentMethod;
import com.example.staylio_backend.model.enums.PaymentStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface PaymentRepo extends JpaRepository<Payment, Long> {
    Optional<Payment> findByBooking_Id(Long bookingId);

    Optional<Payment> findByTransactionId(String transactionId);

    @Query("""
        SELECT p
        FROM Payment p
        JOIN p.booking b
        JOIN b.user u
        JOIN u.profile pf
        JOIN b.room r
        JOIN r.hotelBranch hb
        JOIN hb.hotel h
        WHERE (:search IS NULL
            OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(pf.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(pf.phone) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(p.transactionId) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(p.gatewayOrderId) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND (:status IS NULL OR p.status = :status)
        AND (:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod)
        AND (:hotelBranchId IS NULL OR hb.id = :hotelBranchId)
        AND (:paidFrom IS NULL OR p.paidAt >= :paidFrom)
        AND (:paidTo IS NULL OR p.paidAt <= :paidTo)
        AND (:createdFrom IS NULL OR p.createdAt >= :createdFrom)
        AND (:createdTo IS NULL OR p.createdAt <= :createdTo)
        AND (:minAmount IS NULL OR p.amount >= :minAmount)
        AND (:maxAmount IS NULL OR p.amount <= :maxAmount)
    """)
    Page<Payment> searchPayments(
            @Param("search") String search,
            @Param("status") PaymentStatus status,
            @Param("paymentMethod") PaymentMethod paymentMethod,
            @Param("hotelBranchId") Long hotelBranchId,
            @Param("paidFrom") LocalDateTime paidFrom,
            @Param("paidTo") LocalDateTime paidTo,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            Pageable pageable
    );

    @Query("""
        SELECT p
        FROM Payment p
        JOIN p.booking b
        JOIN b.user u
        JOIN u.profile pf
        JOIN b.room r
        JOIN r.hotelBranch hb
        JOIN hb.hotel h
        WHERE h.manager.id = :managerId
        AND (:search IS NULL
            OR LOWER(b.bookingCode) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(pf.fullName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(pf.phone) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(p.transactionId) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(p.gatewayOrderId) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(r.roomName) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(r.roomNumber) LIKE LOWER(CONCAT('%', :search, '%'))
            OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%'))
        )
        AND (:status IS NULL OR p.status = :status)
        AND (:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod)
        AND (:hotelBranchId IS NULL OR hb.id = :hotelBranchId)
        AND (:paidFrom IS NULL OR p.paidAt >= :paidFrom)
        AND (:paidTo IS NULL OR p.paidAt <= :paidTo)
        AND (:createdFrom IS NULL OR p.createdAt >= :createdFrom)
        AND (:createdTo IS NULL OR p.createdAt <= :createdTo)
        AND (:minAmount IS NULL OR p.amount >= :minAmount)
        AND (:maxAmount IS NULL OR p.amount <= :maxAmount)
    """)
    Page<Payment> searchPaymentsByManager(
            @Param("managerId") Long managerId,
            @Param("search") String search,
            @Param("status") PaymentStatus status,
            @Param("paymentMethod") PaymentMethod paymentMethod,
            @Param("hotelBranchId") Long hotelBranchId,
            @Param("paidFrom") LocalDateTime paidFrom,
            @Param("paidTo") LocalDateTime paidTo,
            @Param("createdFrom") LocalDateTime createdFrom,
            @Param("createdTo") LocalDateTime createdTo,
            @Param("minAmount") BigDecimal minAmount,
            @Param("maxAmount") BigDecimal maxAmount,
            Pageable pageable
    );

    @Query("""
        SELECT p
        FROM Payment p
        JOIN p.booking b
        JOIN b.user u
        WHERE u.id = :userId
          AND (:status IS NULL OR p.status = :status)
          AND (:paymentMethod IS NULL OR p.paymentMethod = :paymentMethod)
        ORDER BY p.createdAt DESC
    """)
    Page<Payment> searchPaymentsByUser(
            @Param("userId") Long userId,
            @Param("status") PaymentStatus status,
            @Param("paymentMethod") PaymentMethod paymentMethod,
            Pageable pageable
    );

    Optional<Payment> findByGatewayOrderId( String gatewayOrderId);

    @Query("SELECT COALESCE(SUM(p.amount), 0) FROM Payment p WHERE p.status = 'PAID'")
    BigDecimal sumTotalRevenue();
}
