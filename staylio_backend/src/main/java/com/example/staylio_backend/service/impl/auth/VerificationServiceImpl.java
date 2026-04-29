package com.example.staylio_backend.service.impl.auth;

import com.example.staylio_backend.exception.AppException;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.entity.VerificationToken;
import com.example.staylio_backend.model.enums.ErrorCode;
import com.example.staylio_backend.model.enums.UserStatus;
import com.example.staylio_backend.model.enums.VerificationType;
import com.example.staylio_backend.repository.VerificationTokenRepo;
import com.example.staylio_backend.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerificationServiceImpl implements VerificationService {
    private final VerificationTokenRepo tokenRepo;

    @Override
    public String createVerificationToken(User user, VerificationType type) {
        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = VerificationToken.builder()
                .token(token)
                .type(type)
                .user(user)
                .expiresAt(LocalDateTime.now().plusHours(24))
                .build();
        tokenRepo.save(verificationToken);
        return token;
    }

    @Override
    public VerificationToken validateToken(String token, VerificationType type) {
        VerificationToken vToken = tokenRepo.findByTokenAndType(token, type)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        if (vToken.getConsumedAt() != null) {
            throw new AppException(ErrorCode.TOKEN_ALREADY_USED);
        }
        if (vToken.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new AppException(ErrorCode.TOKEN_EXPIRED);
        }
        return vToken;
    }

    @Override
    public void verifyEmail(String token) {
        VerificationToken vToken = tokenRepo.findByTokenAndType(token, VerificationType.VERIFY_EMAIL)
                .orElseThrow(() -> new AppException(ErrorCode.INVALID_TOKEN));

        User user = vToken.getUser();
        user.setStatus(UserStatus.ACTIVE);
        user.setIsEmailVerified(true);

        vToken.setConsumedAt(LocalDateTime.now());
        tokenRepo.save(vToken);
    }
}
