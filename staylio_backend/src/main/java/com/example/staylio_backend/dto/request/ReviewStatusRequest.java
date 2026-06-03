package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.ReviewStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ReviewStatusRequest {
    private ReviewStatus status;
}
