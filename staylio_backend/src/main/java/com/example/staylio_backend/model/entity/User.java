package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.model.base.AuditableObject;
import com.example.staylio_backend.model.enums.UserStatus;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User extends AuditableObject {
    @Column(name = "user_name", nullable = false, length = 50)
    private String userName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash")
    private String passwordHash;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "role_id")
    private Role role;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "profile_id", referencedColumnName = "id")
    private Profile profile;

    @Column(name = "provider_id")
    private String providerId;

    @Enumerated(EnumType.STRING)
    private UserStatus status;

    @Column(name = "is_email_verified")
    private Boolean isEmailVerified;

    @Column(name = "is_first_login")
    private Boolean isFirstLogin = true;

    @UpdateTimestamp
    @Column(name = "last_login_at")
    private LocalDateTime lastLoginAt;
}