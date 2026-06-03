package com.example.staylio_backend.controller;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ReplyCommentRequest;
import com.example.staylio_backend.dto.request.ReviewFilterRequest;
import com.example.staylio_backend.dto.request.ReviewRequest;
import com.example.staylio_backend.dto.request.ReviewStatusRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.ReviewerResponse;
import com.example.staylio_backend.dto.response.ReviewResponse;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.service.ReviewService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/reviews")
@RequiredArgsConstructor
public class ReviewController {
    private final ReviewService reviewService;

    @GetMapping
    @Operation(summary = "Danh sách đánh giá phòng")
    public ResponseEntity<ApiResponse<PaginationResponse<ReviewResponse>>> getReviews(
            @ParameterObject ReviewFilterRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        ApiResponse<PaginationResponse<ReviewResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách đánh giá thành công!",
                reviewService.getReviews(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/reviewers")
    @Operation(summary = "Danh sách khách hàng đã đánh giá")
    public ResponseEntity<ApiResponse<List<ReviewerResponse>>> getAllReviewers(
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<List<ReviewerResponse>> response = new ApiResponse<>(
                true,
                "Lấy danh sách khách hàng thành công!",
                reviewService.getAllReviewers(principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết 1 đánh giá")
    public ResponseEntity<ApiResponse<ReviewResponse>> getReviewById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<ReviewResponse> response = new ApiResponse<>(
                true,
                "Lấy chi tiết đánh giá thành công!",
                reviewService.getReviewerById(id, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping
    @Operation(summary = "Tạo 1 đánh giá sau khi đã trả phòng")
    @PreAuthorize("hasRole('CUSTOMER')")
    public ResponseEntity<ApiResponse<ReviewResponse>> createReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        ApiResponse<ReviewResponse> response = new ApiResponse<>(
                true,
                "Tạo đánh giá thành công!",
                reviewService.createReview(request, principal),
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PatchMapping("/{id}/reply-comment")
    @Operation(summary = "Phản hồi đánh giá khách hàng")
    @PreAuthorize("hasRole('MANAGER')")
    public ResponseEntity<ApiResponse<String>> updateReplyComment(
            @PathVariable Long id,
            @Valid @RequestBody ReplyCommentRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ){
        reviewService.updateReplyComment(id, request, principal);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Phản hồi khách hàng thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Cập nhật trạng thái đánh giá")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<String>> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody ReviewStatusRequest request
    ){
        reviewService.updateStatus(id, request);
        ApiResponse<String> response = new ApiResponse<>(
                true,
                "Cập nhật trạng thái thành công!",
                null,
                null,
                LocalDateTime.now()
        );

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}
