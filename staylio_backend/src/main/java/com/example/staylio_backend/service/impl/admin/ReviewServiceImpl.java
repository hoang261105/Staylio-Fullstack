package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.*;
import com.example.staylio_backend.dto.response.ReviewerResponse;
import com.example.staylio_backend.dto.response.ReviewResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.BookingStatus;
import com.example.staylio_backend.model.enums.NotificationType;
import com.example.staylio_backend.model.enums.ReviewStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.BookingRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.repository.ReviewRepo;
import com.example.staylio_backend.service.NotificationService;
import com.example.staylio_backend.service.ReviewService;
import com.example.staylio_backend.service.ModerationService;
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
    private final BookingRepo bookingRepo;
    private final NotificationService notificationService;
    private final ModerationService moderationService;

    @Override
    public PaginationResponse<ReviewResponse> getReviews(ReviewFilterRequest request, UserPrincipal principal) {
        int page = Math.max(request.getPage() - 1, 0);

        Pageable pageable = PageRequest.of(page, request.getSize(), getSort(request.getSortBy(), request.getDirection()));

        Page<Review> reviewPage;

        if (principal != null && principal.hasRole(RoleName.ROLE_MANAGER)){
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
            if (principal == null || (!principal.hasRole(RoleName.ROLE_ADMIN) && !principal.hasRole(RoleName.ROLE_MANAGER))) {
                request.setStatus(ReviewStatus.VISIBLE);
            }
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

        if (principal.hasRole(RoleName.ROLE_ADMIN) || principal.hasRole(RoleName.ROLE_CUSTOMER)) {
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
    public ReviewResponse createReview(ReviewRequest request, UserPrincipal principal) {
        Booking booking = bookingRepo.findById(request.getBookingId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.BOOKING_NOT_FOUND.getMessage()));

        HotelBranch hotelBranch = booking.getRoom().getHotelBranch();

        Profile profile = profileRepo.findById(principal.getId()).orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        if (!booking.getUser().getId().equals(principal.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (booking.getStatus() != BookingStatus.CHECKED_OUT) {
            throw new AppException(ErrorCode.CANNOT_REVIEW_BEFORE_CHECKOUT);
        }

        if (reviewRepo.existsByBooking_IdAndIsDeletedFalse(booking.getId())) {
            throw new AppException(ErrorCode.BOOKING_ALREADY_REVIEWED);
        }

        double toxicityScore = moderationService.getToxicityScore(request.getComment());
        if (toxicityScore > 0.8) {
            throw new AppException(ErrorCode.TOXIC_COMMENT_DETECTED);
        }

        ReviewStatus finalStatus = ReviewStatus.VISIBLE;
        if (toxicityScore >= 0.4) {
            finalStatus = ReviewStatus.PENDING;
        }

        Review review = Review.builder()
                .booking(booking)
                .room(booking.getRoom())
                .profile(profile)
                .rating(request.getRating())
                .comment(request.getComment())
                .status(finalStatus)
                .isDeleted(false)
                .build();

        Review savedReview = reviewRepo.save(review);

        notificationService.create(
                NotificationRequest.builder()
                        .senderId(profile.getId())
                        .receiverId(hotelBranch.getHotel().getManager().getId())
                        .type(NotificationType.REVIEW_CREATED)
                        .referenceId(savedReview.getId())
                        .title("Có đánh giá mới ở phòng " + booking.getRoom().getRoomName())
                        .content(
                                profile.getFullName()
                                        + " đã đánh giá "
                                        + request.getRating()
                                        + " sao cho phòng "
                                        + booking.getRoom().getRoomName()
                                        + " tại chi nhánh "
                                        + hotelBranch.getBranchName()
                        )
                        .build()
        );

        return convertToResponse(savedReview);
    }

    @Override
    public void updateReplyComment(
            Long id,
            ReplyCommentRequest request,
            UserPrincipal principal
    ) {
        Review review = reviewRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.REVIEW_NOT_FOUND.getMessage()
                ));

        Booking booking = review.getBooking();
        HotelBranch hotelBranch = booking.getRoom().getHotelBranch();

        Profile manager = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.USER_NOT_FOUND.getMessage()
                ));

        if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            if (!hotelBranch.getHotel().getManager().getId().equals(manager.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        review.setReplyComment(request.getReplyComment());
        review.setReplyAt(LocalDateTime.now());

        Review savedReview = reviewRepo.save(review);

        notificationService.create(
                NotificationRequest.builder()
                        .senderId(manager.getId())
                        .receiverId(review.getProfile().getId())
                        .type(NotificationType.REVIEW_REPLIED)
                        .referenceId(savedReview.getId())
                        .title("Đánh giá của bạn đã được phản hồi")
                        .content(
                                "Quản lý khách sạn đã phản hồi đánh giá của bạn về phòng "
                                        + booking.getRoom().getRoomName()
                                        + " tại chi nhánh "
                                        + hotelBranch.getBranchName()
                        )
                        .build()
        );
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
                hotelBranch.getHotel().getId(),
                hotelBranch.getHotel().getName(),

                // REPLY
                review.getReplyComment(),
                review.getReplyAt(),

                // STATUS
                review.getStatus()
        );
    }
}
