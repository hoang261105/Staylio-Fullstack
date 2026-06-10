package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.dto.response.AdminDashboardStatsResponse;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.HotelStatus;
import com.example.staylio_backend.repository.HotelBranchRepo;
import com.example.staylio_backend.repository.HotelRepo;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.repository.UserRepo;
import com.example.staylio_backend.service.StatisticAdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class StatisticAdminServiceImpl implements StatisticAdminService {

    private final UserRepo userRepo;
    private final HotelRepo hotelRepo;
    private final HotelBranchRepo hotelBranchRepo;
    private final PaymentRepo paymentRepo;

    @Override
    public AdminDashboardStatsResponse getAdminDashboardStats() {
        BigDecimal totalRevenue = paymentRepo.sumTotalRevenue();
        Long activeCustomers = userRepo.countActiveCustomers();
        Long totalBrands = hotelRepo.countByStatus(HotelStatus.CONFIRMED);
        Long totalBranches = hotelBranchRepo.countByStatus(BranchStatus.CONFIRMED);

        return AdminDashboardStatsResponse.builder()
                .totalRevenue(totalRevenue)
                .activeCustomers(activeCustomers)
                .totalBrands(totalBrands)
                .totalBranches(totalBranches)
                .build();
    }
}
