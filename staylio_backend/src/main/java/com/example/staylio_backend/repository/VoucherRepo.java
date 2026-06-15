package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Voucher;
import com.example.staylio_backend.model.enums.ApprovalStatus;
import com.example.staylio_backend.model.enums.VoucherStatus;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherRepo extends JpaRepository<Voucher, Long> {
      @Query("""
                      select vc from Voucher vc
                      where vc.hotelBranch.id = :hotelBranchId
                        and (:status is null or vc.status = :status)
                        and (vc.approvalStatus in ('PENDING', 'CONFIRMED', 'REJECTED'))
                        and (
                              :search is null
                              or lower(vc.title) like lower(concat('%', :search, '%'))
                              or lower(vc.code) like lower(concat('%', :search, '%'))
                        )
                  """)
      Page<Voucher> searchVouchersByHotelBranchIdAndStatus(
                  Long hotelBranchId,
                  VoucherStatus status,
                  String search,
                  Pageable pageable);

      @Query("""
                      SELECT v FROM Voucher v
                      WHERE v.hotelBranch.hotel.manager.id = :managerId
                        AND (:status IS NULL OR v.status = :status)
                        and (v.approvalStatus in ('PENDING', 'CONFIRMED', 'REJECTED'))
                        AND (
                              :search IS NULL
                              OR :search = ''
                              OR LOWER(v.title) LIKE LOWER(CONCAT('%', :search, '%'))
                              OR LOWER(v.code) LIKE LOWER(CONCAT('%', :search, '%'))
                        )
                  """)
      Page<Voucher> findAllVouchersByManager(
                  @Param("managerId") Long managerId,
                  @Param("status") VoucherStatus status,
                  @Param("search") String search,
                  Pageable pageable);

      @Query("""
                      select vc from Voucher vc
                      where (:status is null or vc.status = :status)
                        and (vc.approvalStatus in ('PENDING', 'CONFIRMED', 'REJECTED'))
                        and (
                              :search is null
                              or lower(vc.title) like lower(concat('%', :search, '%'))
                              or lower(vc.code) like lower(concat('%', :search, '%'))
                        )
                  """)
      Page<Voucher> findAllVouchers(
                  VoucherStatus status,
                  String search,
                  Pageable pageable);

      boolean existsByCode(String code);

      boolean existsByCodeAndIdNot(String code, Long id);

      @Query("SELECT v FROM Voucher v WHERE v.isWelcomeVoucher = true AND v.status = :status AND v.approvalStatus = :approvalStatus")
      List<Voucher> findWelcomeVouchers(@Param("status") VoucherStatus status,
                  @Param("approvalStatus") ApprovalStatus approvalStatus);
}
