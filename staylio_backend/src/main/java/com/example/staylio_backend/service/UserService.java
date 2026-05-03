package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.UserResponseDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

import java.util.List;

public interface UserService {
    PaginationResponse<UserResponseDTO> getStudentList(String search, int page, int size, String sortBy, String direction);

    UserResponseDTO getUserById(Long id);

    UserResponseDTO createUser(UserRegisterRequest userRegisterRequest);

    void updateStatus(Long id, UserPrincipal userPrincipal);

    void updateBulkStatus(List<Long> ids, UserPrincipal userPrincipal, boolean status);
}
