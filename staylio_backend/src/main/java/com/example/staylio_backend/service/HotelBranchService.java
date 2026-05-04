package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

public interface HotelBranchService {
    PaginationResponse<HotelBranchResponse> getHotelBranches(Long hotelId, String search, int page, int size, String sortBy, String direction);
}
