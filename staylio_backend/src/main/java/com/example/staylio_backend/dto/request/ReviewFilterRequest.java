package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.ReviewStatus;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
public class ReviewFilterRequest {
    private String search;

    private Integer rating;
    private ReviewStatus status;

    private Long hotelBranchId;
    private Long roomId;
    private Long userId;

    private LocalDateTime createdFrom;
    private LocalDateTime createdTo;

    private Boolean hasReply;

    private Integer page = 1;
    private Integer size = 5;
    private String sortBy = "createdAt";
    private String direction = "desc";
}
