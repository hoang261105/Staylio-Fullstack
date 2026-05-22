package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProfileRepo extends JpaRepository<Profile, Long> {
    boolean existsByPhoneAndIdNot(String phone, Long id);

    @Query("""
        SELECT DISTINCT r.profile
        FROM Review r
        WHERE r.isDeleted = false
    """)
    List<Profile> findAllReviewers();

    @Query("""
        SELECT DISTINCT r.profile
        FROM Review r
        JOIN r.room room
        JOIN room.hotelBranch branch
        JOIN branch.hotel hotel
        WHERE hotel.manager.id = :managerId
          AND r.isDeleted = false
    """)
    List<Profile> findReviewersByManagerId(@Param("managerId") Long managerId);
}
