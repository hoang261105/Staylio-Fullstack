package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ReplyCommentRequest;
import com.example.staylio_backend.dto.request.ReviewFilterRequest;
import com.example.staylio_backend.dto.request.ReviewStatusRequest;
import com.example.staylio_backend.dto.response.ReviewerResponse;
import com.example.staylio_backend.dto.response.ReviewResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.repository.ReviewRepo;
import com.example.staylio_backend.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    private final ReviewRepo reviewRepo;
    private final ProfileRepo profileRepo;

    @Override
    public PaginationResponse<ReviewResponse> getReviews(ReviewFilterRequest request, UserPrincipal principal) {
        int page = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(page, request.getSize(), getSort(request.getSortBy(), request.getDirection()));

        Page<Review> reviewPage;

        if (principal.hasRole(RoleName.ROLE_ADMIN)){
            reviewPage = reviewRepo.searchReviews(
                    request.getSearch(),
                    request.getRating(),
                    request.getStatus(),
                    request.getHotelBranchId(),
                    request.getRoomId(),
                    request.getUserId(),
                    request.getCreatedFrom(),
                    request.getCreatedTo(),
                    request.getHasReply(),
                    pageable
            );
        } else if (principal.hasRole(RoleName.ROLE_MANAGER)){
            reviewPage = reviewRepo.searchReviewsByManager(
                    principal.getId(),
                    request.getSearch(),
                    request.getRating(),
                    request.getStatus(),
                    request.getHotelBranchId(),
                    request.getRoomId(),
                    request.getUserId(),
                    request.getCreatedFrom(),
                    request.getCreatedTo(),
                    request.getHasReply(),
                    pageable
            );
        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        List<ReviewResponse> content = reviewPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                reviewPage.getNumber() + 1,
                reviewPage.getSize(),
                reviewPage.getTotalPages(),
                reviewPage.getTotalElements()
        );

        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public List<ReviewerResponse> getAllReviewers(UserPrincipal principal) {
        List<Profile> reviewers;

        if (principal.hasRole(RoleName.ROLE_ADMIN)) {
            reviewers = profileRepo.findAllReviewers();
        } else if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

            reviewers = profileRepo.findReviewersByManagerId(profile.getId());
        } else {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return reviewers.stream()
                .map(p -> new ReviewerResponse(
                        p.getId(),
                        p.getFullName()
                ))
                .toList();
    }

    @Override
    public ReviewResponse getReviewerById(Long id, UserPrincipal principal) {
        Review review = reviewRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.REVIEW_NOT_FOUND.getMessage()));

        HotelBranch hotelBranch = review.getBooking().getRoom().getHotelBranch();

        if (principal.hasRole(RoleName.ROLE_MANAGER)){
            if (!hotelBranch.getHotel().getManager().getId().equals(principal.getId())){
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }
        return convertToResponse(review);
    }

    @Override
    public void updateReplyComment(Long id, ReplyCommentRequest request, UserPrincipal principal) {
        Review review = reviewRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.REVIEW_NOT_FOUND.getMessage()));

        HotelBranch hotelBranch = review.getBooking().getRoom().getHotelBranch();

        if (principal.hasRole(RoleName.ROLE_MANAGER)){
            if (!hotelBranch.getHotel().getManager().getId().equals(principal.getId())){
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        review.setReplyComment(request.getReplyComment());
        review.setReplyAt(LocalDateTime.now());

        reviewRepo.save(review);
    }

    @Override
    public void updateStatus(Long id, ReviewStatusRequest request) {
        Review review = reviewRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.REVIEW_NOT_FOUND.getMessage()));

        review.setStatus(request.getStatus());
        reviewRepo.save(review);
    }

    private Sort getSort(String sortBy, String direction) {

        Sort.Direction dir = "asc".equalsIgnoreCase(direction)
                ? Sort.Direction.ASC
                : Sort.Direction.DESC;

        String safeSortBy = (sortBy == null || sortBy.isBlank())
                ? "createdAt"
                : sortBy;

        String property = switch (safeSortBy) {

            case "rating" -> "rating";
            case "createdAt" -> "createdAt";
            case "replyAt" -> "replyAt";
            case "status" -> "status";

            case "roomName" -> "booking.room.roomName";
            case "roomNumber" -> "booking.room.roomNumber";

            case "customerName" -> "booking.user.profile.fullName";

            case "hotelBranchName" ->
                    "booking.room.hotelBranch.branchName";

            default -> "createdAt";
        };

        return Sort.by(dir, property);
    }

    private ReviewResponse convertToResponse(Review review) {

        Booking booking = review.getBooking();

        User user = booking.getUser();

        Room room = booking.getRoom();

        HotelBranch hotelBranch = room.getHotelBranch();

        String roomImage = room.getImages() != null
                ? room.getImages()
                  .stream()
                  .filter(RoomImage::getIsPrimary)
                  .map(RoomImage::getImageUrl)
                  .findFirst()
                  .orElse(null)
                : null;

        return new ReviewResponse(
                review.getId(),

                // REVIEW
                review.getRating(),
                review.getComment(),
                review.getCreatedAt(),

                // CUSTOMER
                user.getId(),
                user.getProfile().getFullName(),
                user.getProfile().getAvatarUrl(),

                // BOOKING
                booking.getId(),
                booking.getBookingCode(),

                // ROOM
                room.getId(),
                roomImage,
                room.getRoomNumber(),
                room.getRoomName(),

                // HOTEL
                hotelBranch.getId(),
                hotelBranch.getBranchName(),
                hotelBranch.getHotel().getName(),

                // REPLY
                review.getReplyComment(),
                review.getReplyAt(),

                // STATUS
                review.getStatus()
        );
    }
}
