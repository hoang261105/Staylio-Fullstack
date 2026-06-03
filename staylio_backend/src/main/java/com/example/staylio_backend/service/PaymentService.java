package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.PaymentFilterRequest;
import com.example.staylio_backend.dto.request.PaymentStatusRequest;
import com.example.staylio_backend.dto.response.PaymentResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.enums.PaymentStatus;

import java.util.Map;

public interface PaymentService {
    PaginationResponse<PaymentResponse> getAllPayments(
            PaymentFilterRequest request,
            UserPrincipal principal
    );

    PaymentResponse getByBookingId(Long bookingId);

    void updateStatus(
            Long paymentId,
            PaymentStatusRequest request
    );

    Map<String, Object> handleZaloPayCallback(Map<String, Object> body);
}
