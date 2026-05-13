package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Province;
import com.example.staylio_backend.model.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProvinceRepo extends JpaRepository<Province, Long> {
    List<Province> findByProvinceContainingIgnoreCase(String keyword);
}