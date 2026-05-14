package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.HotelBranch;
import com.example.staylio_backend.model.enums.BranchStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelBranchRepo extends JpaRepository<HotelBranch, Long> {
    @Query("""
    SELECT b FROM HotelBranch b
    WHERE (:hotelId IS NULL OR b.hotel.id = :hotelId)
      AND (:search IS NULL OR LOWER(b.branchName) LIKE LOWER(CONCAT('%', :search, '%')))
      AND (:status IS NULL OR b.status = :status)
      AND b.status <> 'DELETED'
""")
    Page<HotelBranch> searchBranches(
            Long hotelId,
            String search,
            BranchStatus status,
            Pageable pageable
    );

    List<HotelBranch> findAllByHotel_Id(Long hotelId);
    boolean existsByIdAndHotelManagerId(Long branchId, Long managerId);

    boolean existsByBranchNameAndHotel_Id(String branchName, Long hotelId);
    boolean existsByPhone(String phone);
    boolean existsByBranchNameAndHotel_IdAndIdNot(
            String branchName,
            Long hotelId,
            Long id
    );
    boolean existsByPhoneAndIdNot(String phone, Long id);
}
