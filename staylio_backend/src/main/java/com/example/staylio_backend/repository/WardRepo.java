package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WardRepo extends JpaRepository<Ward, Long> {
    List<Ward> findAllByProvinceId(Long provinceId);

    List<Ward> findByProvinceIdAndNameContainingIgnoreCase(Long provinceId, String keyword);

    Optional<Ward> findByNameIgnoreCase(String name);
}