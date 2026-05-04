package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Hotel;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, Long> {
    @Query("SELECT h FROM Hotel h WHERE h.status in ('PENDING', 'CONFIRMED', 'REJECTED')" +
            "AND (:search IS NULL OR :search = '' OR LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Hotel> searchActiveHotels(@Param("search") String search, Pageable pageable);

    boolean existsByName(String name);

    boolean existsByNameAndIdNot(String name, Long id);
}
