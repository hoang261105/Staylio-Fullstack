package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BranchStatusRequest;
import com.example.staylio_backend.dto.request.HotelBranchRequest;
import com.example.staylio_backend.dto.request.HotelIdRequest;
import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.BranchStatus;

import java.util.List;

public interface HotelBranchService {
    PaginationResponse<HotelBranchResponse> getHotelBranches(Long hotelId, String search, BranchStatus status, int page, int size, String sortBy, String direction);

    HotelBranchResponse getHotelBranchById(Long id, UserPrincipal userPrincipal);

    void updateStatus(Long id, BranchStatusRequest request);

    HotelBranchResponse addBranch(UserPrincipal userPrincipal, HotelBranchRequest request);

    HotelBranchResponse updateBranch(Long id, UserPrincipal principal, HotelBranchRequest request);

    void deleteStatus(Long id, HotelIdRequest request, UserPrincipal principal);

    List<HotelBranchResponse> getAllBranchesByHotelId (Long hotelId, BranchStatus status, UserPrincipal principal);
}

