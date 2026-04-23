package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.auth.BlacklistToken;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlacklistTokenRepo extends JpaRepository<BlacklistToken, Long> {
    boolean existsByToken(String token);
}