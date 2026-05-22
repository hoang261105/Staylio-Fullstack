package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.ReviewStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class ReviewResponse {
    private Long id;

    private Integer rating;
    private String comment;
    private LocalDateTime createdAt;

    private Long reviewerId;
    private String fullName;
    private String avatarUrl;

    private Long bookingId;
    private String bookingCode;

    private Long roomId;
    private String roomImage;
    private String roomNumber;
    private String roomName;

    // HOTEL
    private Long hotelBranchId;
    private String hotelBranchName;
    private String hotelName;

    // REPLY
    private String replyComment;
    private LocalDateTime replyAt;

    private ReviewStatus status;
}
