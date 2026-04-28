package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.model.base.BaseObject;
import com.example.staylio_backend.model.enums.VerificationType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "verification_tokens")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class VerificationToken extends BaseObject {
    @Column(name = "token", nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    private VerificationType type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Column(name = "expires_at")
    private LocalDateTime expiresAt;

    @Column(name = "consumed_at")
    private LocalDateTime consumedAt;


}

