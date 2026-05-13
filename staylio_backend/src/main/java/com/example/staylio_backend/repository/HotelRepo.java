package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Hotel;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.enums.HotelStatus;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface HotelRepo extends JpaRepository<Hotel, Long> {
    @Query("SELECT h FROM Hotel h WHERE h.status in ('PENDING', 'CONFIRMED', 'REJECTED')" +
            "AND (:search IS NULL OR :search = '' OR LOWER(h.name) LIKE LOWER(CONCAT('%', :search, '%')))")
    Page<Hotel> searchActiveHotels(@Param("search") String search, Pageable pageable);

    boolean existsByName(String name);
    boolean existsByManager_Id(Long managerId);
    Optional<Hotel> findByManager(Profile manager);

    boolean existsByNameAndIdNot(String name, Long id);

    List<Hotel> findAllByIdIn(List<Long> ids);

    @Modifying
    @Transactional
    @Query("UPDATE Hotel h SET h.isActive = :active WHERE h.id in :ids")
    void updateBulkActive(@Param("ids") List<Long> ids, @Param("active") boolean active);
}
