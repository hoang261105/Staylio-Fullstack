package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Ward;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WardRepo extends JpaRepository<Ward, Long> {}