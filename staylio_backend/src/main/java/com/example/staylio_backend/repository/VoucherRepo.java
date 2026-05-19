package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Voucher;
import com.example.staylio_backend.model.enums.VoucherStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface VoucherRepo extends JpaRepository<Voucher, Long> {
    @Query("""
        select vc from Voucher vc
        where vc.hotelBranch.id = :hotelBranchId
          and (:status is null or vc.status = :status)
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
            Pageable pageable
    );

    @Query("""
        select vc from Voucher vc
        where (:status is null or vc.status = :status)
          and (
                :search is null
                or lower(vc.title) like lower(concat('%', :search, '%'))
                or lower(vc.code) like lower(concat('%', :search, '%'))
          )
    """)
    Page<Voucher> findAllVouchers(
            VoucherStatus status,
            String search,
            Pageable pageable
    );

    boolean existsByCode(String code);
    boolean existsByCodeAndIdNot(String code, Long id);
}
