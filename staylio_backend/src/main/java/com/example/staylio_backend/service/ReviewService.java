package com.example.staylio_backend.service;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ReplyCommentRequest;
import com.example.staylio_backend.dto.request.ReviewFilterRequest;
import com.example.staylio_backend.dto.request.ReviewRequest;
import com.example.staylio_backend.dto.request.ReviewStatusRequest;
import com.example.staylio_backend.dto.response.ReviewerResponse;
import com.example.staylio_backend.dto.response.ReviewResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;

import java.util.List;

public interface ReviewService {
    PaginationResponse<ReviewResponse> getReviews(ReviewFilterRequest request, UserPrincipal principal);

    List<ReviewerResponse> getAllReviewers(UserPrincipal principal);

    ReviewResponse getReviewerById(Long id, UserPrincipal principal);

    ReviewResponse createReview(ReviewRequest request, UserPrincipal principal);

    void updateReplyComment(Long id, ReplyCommentRequest request, UserPrincipal principal);

    void updateStatus(Long id, ReviewStatusRequest request);
}
