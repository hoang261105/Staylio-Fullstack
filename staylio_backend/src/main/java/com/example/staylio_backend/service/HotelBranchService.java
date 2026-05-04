package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.BranchStatus;

public interface HotelBranchService {
    PaginationResponse<HotelBranchResponse> getHotelBranches(Long hotelId, String search, int page, int size, String sortBy, String direction);

    HotelBranchResponse getHotelBranchById(Long id);

    void updateStatus(Long id, BranchStatus status);
}

