package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.HotelBranch;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelBranchRepo extends JpaRepository<HotelBranch, Long> {
    @Query("SELECT hb FROM HotelBranch hb WHERE " +
            "(:hotelId IS NULL OR hb.hotel.id = :hotelId) AND " +
            "(:search IS NULL OR :search = '' OR LOWER(hb.branchName) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<HotelBranch> searchBranches(@Param("hotelId") Long hotelId,
                                     @Param("search") String search,
                                     Pageable pageable);
}
