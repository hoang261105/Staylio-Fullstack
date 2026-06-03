package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Utility;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UtilityRepo extends JpaRepository<Utility, Long> {
    Page<Utility> findAllByTitleContainingIgnoreCase(String title, Pageable pageable);

    @Query("""
        SELECT u FROM Room r
        JOIN r.utilities u
        WHERE r.id = :roomId
          AND u.isDeleted = false
    """)
    List<Utility> findUtilitiesByRoomId(@Param("roomId") Long roomId);

    List<Utility> findAllByIdInAndIsDeletedFalse(Set<Long> ids);

    List<Utility> findAllByIsDeletedFalse();

    boolean existsByTitleIgnoreCase(String title);
    boolean existsByTitleIgnoreCaseAndIdNot(String title, Long id);
}
