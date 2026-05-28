package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface UserVoucherRepo extends JpaRepository<UserVoucher, Long> {

    @Query("""
        SELECT DISTINCT uv
        FROM UserVoucher uv
        JOIN uv.voucher v
        LEFT JOIN v.hotelBranch hb
        LEFT JOIN v.rooms vr
        WHERE uv.user.id = :userId

          AND v.status = VoucherStatus.ACTIVE
          AND v.approvalStatus = ApprovalStatus.CONFIRMED

          AND (v.startDate IS NULL OR v.startDate <= CURRENT_TIMESTAMP)
          AND (v.expiryDate IS NULL OR v.expiryDate >= CURRENT_TIMESTAMP)

          AND (v.totalUsageLimit IS NULL OR v.currentUsageCount < v.totalUsageLimit)

          AND (:originalPrice IS NULL OR v.minOrderValue IS NULL OR v.minOrderValue <= :originalPrice)

          AND (
                v.hotelBranch IS NULL
                OR hb.id = :branchId
          )

          AND (
                v.scope = VoucherScope.ALL_ROOMS
                OR (
                    v.scope = VoucherScope.SPECIFIC_ROOMS
                    AND vr.id = :roomId
                )
          )
    """)
    List<UserVoucher> findApplicableUserVouchers(
            @Param("userId") Long userId,
            @Param("branchId") Long branchId,
            @Param("roomId") Long roomId,
            @Param("originalPrice") BigDecimal originalPrice
    );
}
