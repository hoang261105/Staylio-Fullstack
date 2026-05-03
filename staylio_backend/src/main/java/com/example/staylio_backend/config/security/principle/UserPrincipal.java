package com.example.staylio_backend.config.security.principle;

import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.UserStatus;
import com.example.staylio_backend.model.enums.Gender;
import com.example.staylio_backend.model.enums.RoleName;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.Collections;
import java.util.List;

@Getter
@RequiredArgsConstructor
public class UserPrincipal implements UserDetails {

    private final User account;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if (account.getRole() == null || account.getRole().getRoleName() == null) return List.of();
        return List.of(new SimpleGrantedAuthority(account.getRole().getRoleName().name()));
    }

    @Override
    public String getPassword() {
        return account.getPasswordHash();
    }

    @Override
    public String getUsername() {
        return account.getEmail();
    }


    @Override
    public boolean isAccountNonLocked() {
        return account.getStatus() == UserStatus.ACTIVE;
    }

    public boolean hasRole(RoleName role) {
        return getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals(role.name()));
    }

    public static UserPrincipal create(User user) {
        return new UserPrincipal(user);
    }

    @Override
    public boolean isEnabled() {
        return account.getStatus() == UserStatus.ACTIVE;
    }

    public Long getId() { return account.getId(); }
    public String getFullName() { return account.getProfile() != null ? account.getProfile().getFullName() : null; }
    public String getEmail() { return account.getEmail(); }
    public String getAvatarUrl() { return account.getProfile() != null ? account.getProfile().getAvatarUrl() : null; }
    public Gender isGender () {
        return account.getProfile() != null ? account.getProfile().getGender() : null;
    }
    public LocalDate getDateOfBirth() { return account.getProfile() != null ? account.getProfile().getDateOfBirth() : null; }
    public String getPhone() { return account.getProfile() != null ? account.getProfile().getPhone() : null; }
    public String getAddress() { return account.getProfile() != null ? account.getProfile().getAddress() : null; }
    public RoleName getRoleName() { return account.getRole().getRoleName(); }
}
