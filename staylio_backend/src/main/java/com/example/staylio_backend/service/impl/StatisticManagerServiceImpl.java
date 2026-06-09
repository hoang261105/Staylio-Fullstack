package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ManagerDashboardStatsResponse;
import com.example.staylio_backend.repository.BookingRepo;
import com.example.staylio_backend.repository.RoomRepo;
import com.example.staylio_backend.service.StatisticManagerService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class StatisticManagerServiceImpl implements StatisticManagerService {
    private final RoomRepo roomRepo;
    private final BookingRepo bookingRepo;

    @Override
    public ManagerDashboardStatsResponse getManagerDashboardStats(
            UserPrincipal principal
    ) {
        Long managerId = principal.getId();

        Long totalRooms =
                roomRepo.countTotalRooms(managerId);

        Long stayingGuests =
                bookingRepo.countStayingGuests(managerId);

        Long newBookings =
                bookingRepo.countNewBookings(
                        managerId,
                        LocalDateTime.now().minusDays(7)
                );

        BigDecimal estimatedRevenue =
                bookingRepo.calculateEstimatedRevenue(managerId);

        return ManagerDashboardStatsResponse.builder()
                .totalRooms(totalRooms)
                .stayingGuests(stayingGuests)
                .newBookings(newBookings)
                .estimatedRevenue(estimatedRevenue)

                // Demo hardcode
                .roomGrowth(2)
                .guestGrowthPercent(12.0)
                .bookingGrowthPercent(5.0)
                .revenueGrowthPercent(8.4)

                .build();
    }
}
