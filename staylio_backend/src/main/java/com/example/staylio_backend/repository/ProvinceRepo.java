package com.example.staylio_backend.repository;

import com.example.staylio_backend.dto.response.FeaturedLocationResponse;
import com.example.staylio_backend.model.entity.Province;
import com.example.staylio_backend.model.entity.Ward;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinceRepo extends JpaRepository<Province, Long> {
    List<Province> findByProvinceContainingIgnoreCase(String keyword);

    @Query(value = """
        SELECT new com.example.staylio_backend.dto.response.FeaturedLocationResponse(
            p.id,
            p.province,
            p.imageURL,
            COUNT(DISTINCT h.id),
            COUNT(DISTINCT hb.id)
        )
        FROM HotelBranch hb
        JOIN hb.hotel h
        JOIN hb.ward w
        JOIN w.province p
        WHERE hb.isActive = true
          AND hb.status = com.example.staylio_backend.model.enums.BranchStatus.CONFIRMED
          AND h.status = com.example.staylio_backend.model.enums.HotelStatus.CONFIRMED
        GROUP BY p.id, p.province, p.imageURL
        ORDER BY COUNT(DISTINCT hb.id) DESC
    """, countQuery = """
        SELECT COUNT(DISTINCT p.id)
        FROM HotelBranch hb
        JOIN hb.hotel h
        JOIN hb.ward w
        JOIN w.province p
        WHERE hb.isActive = true
          AND hb.status = com.example.staylio_backend.model.enums.BranchStatus.CONFIRMED
          AND h.status = com.example.staylio_backend.model.enums.HotelStatus.CONFIRMED
    """)
    Page<FeaturedLocationResponse> findFeaturedLocations(Pageable pageable);
}