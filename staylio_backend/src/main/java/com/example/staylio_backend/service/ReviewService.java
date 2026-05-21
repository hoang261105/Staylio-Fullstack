package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ReviewFilterRequest;
import com.example.staylio_backend.dto.response.ReviewResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

public interface ReviewService {
    PaginationResponse<ReviewResponse> getReviews(ReviewFilterRequest request, UserPrincipal principal);
}
