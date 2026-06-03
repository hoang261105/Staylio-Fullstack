package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BookingFilterRequest;
import com.example.staylio_backend.dto.request.BookingHistoryRequest;
import com.example.staylio_backend.dto.request.BookingRequest;
import com.example.staylio_backend.dto.request.BookingStatusRequest;
import com.example.staylio_backend.dto.response.BookingHistoryResponse;
import com.example.staylio_backend.dto.response.BookingPreviewResponse;
import com.example.staylio_backend.dto.response.BookingResponse;
import com.example.staylio_backend.dto.response.DateRangeResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

import java.util.List;

public interface BookingService {
    PaginationResponse<BookingResponse> getAllBookings(BookingFilterRequest request, UserPrincipal principal);

    BookingResponse getBookingById(Long id, UserPrincipal principal);

    void updateStatus(Long id, BookingStatusRequest request, UserPrincipal principal);

    BookingPreviewResponse previewBooking(BookingRequest request, UserPrincipal principal);

    BookingResponse createBooking(BookingRequest request, UserPrincipal principal);

    List<DateRangeResponse> getBookedDates(Long roomId);

    PaginationResponse<BookingHistoryResponse> getMyBookings(
            BookingHistoryRequest request,
            UserPrincipal principal
    );
}
