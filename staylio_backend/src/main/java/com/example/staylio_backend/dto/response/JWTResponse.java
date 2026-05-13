package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.Gender;
import com.example.staylio_backend.model.enums.UserStatus;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;

import java.time.LocalDate;
import java.util.Collection;

@Getter
@Setter
@NoArgsConstructor
@Builder
public class JWTResponse {
    private Long id;
    private String email;
    private String fullName;
    private String avatarUrl;
    private Gender gender;
    private LocalDate dateOfBirth;
    private String phone;
    private UserStatus status;
    private String address;
    private Collection<? extends GrantedAuthority> authorities;
    private String accessToken;
    private String refreshToken;

    public JWTResponse(Long id, String email, String fullName, String avatarUrl, Gender gender, LocalDate dateOfBirth, String phone, UserStatus status, String address, Collection<? extends GrantedAuthority> authorities, String accessToken, String refreshToken) {
        this.id = id;
        this.email = email;
        this.fullName = fullName;
        this.avatarUrl = avatarUrl;
        this.gender = gender;
        this.dateOfBirth = dateOfBirth;
        this.phone = phone;
        this.status = status;
        this.address = address;
        this.authorities = authorities;
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
    }
}
