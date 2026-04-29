package com.example.staylio_backend.utils;

public class APIConstants {
    public static final String[] PUBLIC_WHITELIST = {
            "/auth/**",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html"
    };

    public static final String ADMIN_USERS = "/api/v1/admin/users";
    public static final String ADMIN_USER_BY_ID = "/api/v1/admin/users/{id}";
    public static final String ADMIN_USER_STATUS = "/api/v1/admin/users/{id}/status";
    public static final String ADMIN_USER_BULK_STATUS = "/api/v1/admin/users/bulk-status";

    public static final String[] ADMIN_USER_ENDPOINTS = {
            "/api/v1/admin/users/**"
    };
}
