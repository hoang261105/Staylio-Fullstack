package com.example.staylio_backend.service;

import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.entity.VerificationToken;
import com.example.staylio_backend.model.enums.VerificationType;

public interface VerificationService {
    String createVerificationToken(User user, VerificationType type);

    VerificationToken validateToken(String token, VerificationType type);

    void verifyEmail(String token);
}
