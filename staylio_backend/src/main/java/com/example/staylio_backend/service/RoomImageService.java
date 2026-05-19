package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomImageStatusRequest;
import com.example.staylio_backend.dto.response.RoomImageAdminResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.ImageStatus;

public interface RoomImageService {
    PaginationResponse<RoomImageAdminResponse> getAllImages(String search, Long roomId, ImageStatus status, int page, int size, String sortBy, String direction);

    RoomImageAdminResponse getRoomImageById(Long id);

    void updateStatus(Long id, RoomImageStatusRequest request, UserPrincipal userPrincipal);
}
