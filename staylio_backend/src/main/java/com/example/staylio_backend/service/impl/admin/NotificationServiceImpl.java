package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.NotificationRequest;
import com.example.staylio_backend.dto.response.NotificationResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.Notification;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.repository.NotificationRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
        private final NotificationRepo notificationRepo;
        private final ProfileRepo profileRepo;

        @Override
        public PaginationResponse<NotificationResponse> getMyNotifications(int page, int size,
                        UserPrincipal principal) {
                Profile profile = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

                Pageable pageable = PageRequest.of(
                                Math.max(page - 1, 0),
                                size);

                Page<Notification> notificationPage = notificationRepo.findAllByReceiverId(profile.getId(), pageable);

                List<NotificationResponse> content = notificationPage.getContent()
                                .stream()
                                .map(this::convertToResponse)
                                .toList();

                PaginationDTO paginationDTO = new PaginationDTO(
                                notificationPage.getNumber() + 1,
                                notificationPage.getSize(),
                                notificationPage.getTotalPages(),
                                notificationPage.getTotalElements());

                return new PaginationResponse<>(content, paginationDTO);
        }

        @Override
        public Long countMyUnreadNotifications(UserPrincipal principal) {
                Profile profile = profileRepo.findById(principal.getId())
                                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

                return notificationRepo
                                .countByReceiver_IdAndIsReadFalseAndIsDeletedFalse(
                                                profile.getId());
        }

        @Override
        public NotificationResponse create(NotificationRequest request) {
                Profile sender = null;

                if (request.getSenderId() != null) {
                        sender = profileRepo.findById(request.getSenderId())
                                        .orElseThrow(() -> new NoSuchElementException("Không tìm thấy sender!"));
                }

                Profile receiver = profileRepo.findById(request.getReceiverId())
                                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy receiver!"));

                Notification notification = Notification.builder()
                                .sender(sender)
                                .receiver(receiver)
                                .title(request.getTitle())
                                .content(request.getContent())
                                .type(request.getType())
                                .referenceId(request.getReferenceId())
                                .isRead(false)
                                .isDeleted(false)
                                .build();

                Notification savedNotification = notificationRepo.save(notification);

                return convertToResponse(savedNotification);
        }

        private NotificationResponse convertToResponse(Notification notification) {
                return new NotificationResponse(
                                notification.getId(),
                                notification.getSender().getId(),
                                notification.getSender().getFullName(),
                                notification.getSender().getAvatarUrl(),
                                notification.getReceiver().getId(),
                                notification.getTitle(),
                                notification.getContent(),
                                notification.getType(),
                                notification.getReferenceId(),
                                notification.getIsRead(),
                                notification.getReadAt(),
                                notification.getCreatedAt());
        }

        @Override
        public void markAsRead(Long notificationId, UserPrincipal principal) {
                Notification notification = notificationRepo.findById(notificationId)
                                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thông báo!"));

                if (!notification.getReceiver().getId().equals(principal.getId())) {
                        throw new IllegalArgumentException("Không có quyền truy cập thông báo này!");
                }

                if (!notification.getIsRead()) {
                        notification.setIsRead(true);
                        notification.setReadAt(LocalDateTime.now());
                        notificationRepo.save(notification);
                }
        }
}
