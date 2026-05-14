package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomRequest;
import com.example.staylio_backend.dto.request.RoomStatusRequest;
import com.example.staylio_backend.dto.response.RoomResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.RoomStatus;

public interface RoomService {
    PaginationResponse<RoomResponse> getAllRooms(String search, Long hotelBranchId, int page, int size, RoomStatus status, String sortBy, String direction);

    RoomResponse getRoomById(Long id, UserPrincipal userPrincipal);

    RoomResponse createRoom(RoomRequest request, UserPrincipal userPrincipal);

    RoomResponse updateRoom(Long id, RoomRequest request, UserPrincipal userPrincipal);

    void updateStatus(Long id, RoomStatusRequest request, UserPrincipal principal);

    void updateActive(Long id, UserPrincipal userPrincipal);

    void updateVoucher(Long id, UserPrincipal userPrincipal);
}
