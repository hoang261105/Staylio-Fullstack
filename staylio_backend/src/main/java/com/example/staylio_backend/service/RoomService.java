package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomRequest;
import com.example.staylio_backend.dto.request.RoomStatusRequest;
import com.example.staylio_backend.dto.request.SearchRoomRequest;
import com.example.staylio_backend.dto.response.RoomResponse;
import com.example.staylio_backend.dto.response.RoomSearchResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.RoomStatus;

import java.time.LocalDate;
import java.util.List;

public interface RoomService {
    PaginationResponse<RoomResponse> getRoomsBySearch(String search, Long hotelBranchId, int page, int size, RoomStatus status, String sortBy, String direction);

    List<RoomResponse> getAllRooms(Long hotelBranchId);

    RoomResponse getRoomById(Long id, UserPrincipal userPrincipal);

    RoomResponse createRoom(RoomRequest request, UserPrincipal userPrincipal);

    RoomResponse updateRoom(Long id, RoomRequest request, UserPrincipal userPrincipal);

    void updateStatus(Long id, RoomStatusRequest request, UserPrincipal principal);

    void updateActive(Long id, UserPrincipal userPrincipal);

    void updateVoucher(Long id, UserPrincipal userPrincipal);

    PaginationResponse<RoomSearchResponse> searchRooms(
            SearchRoomRequest request
    );
}
