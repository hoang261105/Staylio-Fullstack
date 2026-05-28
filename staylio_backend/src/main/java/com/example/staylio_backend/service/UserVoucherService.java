package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ApplicableVoucherResponse;

import java.time.LocalDate;
import java.util.List;

public interface UserVoucherService {
    List<ApplicableVoucherResponse> getApplicableVouchers(
            Long roomId,
            LocalDate checkInDate,
            LocalDate checkOutDate,
            UserPrincipal principal
    );
}
