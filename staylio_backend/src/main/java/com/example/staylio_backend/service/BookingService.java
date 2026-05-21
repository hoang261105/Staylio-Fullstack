package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BookingFilterRequest;
import com.example.staylio_backend.dto.request.BookingStatusRequest;
import com.example.staylio_backend.dto.response.BookingResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

public interface BookingService {
    PaginationResponse<BookingResponse> getAllBookings(BookingFilterRequest request, UserPrincipal principal);

    BookingResponse getBookingById(Long id, UserPrincipal principal);

    void updateStatus(Long id, BookingStatusRequest request, UserPrincipal principal);
}
