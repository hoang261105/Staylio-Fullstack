package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Profile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProfileRepo extends JpaRepository<Profile, Long> {
    boolean existsByPhoneAndIdNot(String phone, Long id);
}
