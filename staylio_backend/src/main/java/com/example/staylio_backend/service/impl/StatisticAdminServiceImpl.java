package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.dto.response.AdminDashboardStatsResponse;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.HotelStatus;
import com.example.staylio_backend.repository.HotelBranchRepo;
import com.example.staylio_backend.repository.HotelRepo;
import com.example.staylio_backend.repository.PaymentRepo;
import com.example.staylio_backend.repository.BookingRepo;
import com.example.staylio_backend.repository.UserRepo;
import com.example.staylio_backend.dto.response.MonthlyRevenueResponse;
import com.example.staylio_backend.dto.response.WeeklyBookingResponse;
import com.example.staylio_backend.model.entity.Booking;
import com.example.staylio_backend.model.enums.BookingStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.DayOfWeek;
import java.time.format.TextStyle;
import java.util.Locale;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;
import java.util.stream.Collectors;
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
    private final BookingRepo bookingRepo;

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

    @Override
    public List<MonthlyRevenueResponse> getMonthlyRevenue(int year) {
        List<Object[]> rawData = paymentRepo.getMonthlyRevenueByYear(year);
        
        // Initialize all 12 months with 0
        List<MonthlyRevenueResponse> responses = new ArrayList<>();
        for (int i = 1; i <= 12; i++) {
            responses.add(new MonthlyRevenueResponse(i, BigDecimal.ZERO));
        }
        
        // Fill in the actual data
        for (Object[] row : rawData) {
            int month = ((Number) row[0]).intValue();
            BigDecimal revenue = (BigDecimal) row[1];
            responses.get(month - 1).setRevenue(revenue);
        }
        
        return responses;
    }

    @Override
    public List<WeeklyBookingResponse> getWeeklyBookings() {
        // Get start and end of current week (Monday to Sunday)
        LocalDate today = LocalDate.now();
        LocalDate monday = today.with(DayOfWeek.MONDAY);
        LocalDate sunday = today.with(DayOfWeek.SUNDAY);
        
        LocalDateTime startOfWeek = monday.atStartOfDay();
        LocalDateTime endOfWeek = sunday.atTime(LocalTime.MAX);
        
        List<Booking> bookings = bookingRepo.findBookingsBetweenDates(startOfWeek, endOfWeek);
        
        List<WeeklyBookingResponse> responses = new ArrayList<>();
        DayOfWeek[] days = {DayOfWeek.MONDAY, DayOfWeek.TUESDAY, DayOfWeek.WEDNESDAY, 
                           DayOfWeek.THURSDAY, DayOfWeek.FRIDAY, DayOfWeek.SATURDAY, DayOfWeek.SUNDAY};
        String[] dayNames = {"T2", "T3", "T4", "T5", "T6", "T7", "CN"};
        
        for (int i = 0; i < 7; i++) {
            final DayOfWeek currentDay = days[i];
            
            long confirmed = bookings.stream()
                .filter(b -> b.getCreatedAt().getDayOfWeek() == currentDay && 
                            b.getStatus() == BookingStatus.CONFIRMED)
                .count();
                
            long pending = bookings.stream()
                .filter(b -> b.getCreatedAt().getDayOfWeek() == currentDay && 
                            b.getStatus() == BookingStatus.PENDING_PAYMENT)
                .count();
                
            responses.add(new WeeklyBookingResponse(dayNames[i], confirmed, pending));
        }
        
        return responses;
    }
}
