package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.VoucherRequest;
import com.example.staylio_backend.dto.request.VoucherStatusRequest;
import com.example.staylio_backend.dto.response.VoucherResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.VoucherStatus;
import org.springframework.data.domain.Page;

public interface VoucherService {
    PaginationResponse<VoucherResponse> getAllVouchers(String search, Long hotelBranchId, int page, int size, VoucherStatus status, String sortBy, String direction);

    VoucherResponse getVoucherById(Long id, UserPrincipal userPrincipal);

    VoucherResponse createVoucher(VoucherRequest request, UserPrincipal userPrincipal);

    VoucherResponse updateVoucher(Long id, VoucherRequest request, UserPrincipal userPrincipal);

    void updateStatus(Long id, VoucherStatusRequest request, UserPrincipal userPrincipal);
}
