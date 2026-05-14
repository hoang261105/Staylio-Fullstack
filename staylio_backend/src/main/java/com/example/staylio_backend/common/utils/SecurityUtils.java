package com.example.staylio_backend.common.utils;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtils {
    public static UserPrincipal getCurrentUser() {
        Authentication authentication =
                SecurityContextHolder.getContext().getAuthentication();

        return (UserPrincipal) authentication.getPrincipal();
    }
}
