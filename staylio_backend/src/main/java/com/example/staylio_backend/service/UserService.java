package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.response.UserResponseDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

public interface UserService {
    PaginationResponse<UserResponseDTO> getStudentList(String search, int page, int size, String sortBy, String direction);
}
