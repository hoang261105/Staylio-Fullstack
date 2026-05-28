package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.NotificationRequest;
import com.example.staylio_backend.dto.response.NotificationResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

public interface NotificationService {
    PaginationResponse<NotificationResponse> getMyNotifications(
            int page,
            int size,
            UserPrincipal principal
    );

    Long countMyUnreadNotifications(UserPrincipal principal);

    NotificationResponse create(NotificationRequest request);

    void markAsRead(Long notificationId, UserPrincipal principal);
}
