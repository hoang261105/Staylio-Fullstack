package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.RoomImageStatusRequest;
import com.example.staylio_backend.dto.response.RoomImageAdminResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.HotelBranch;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.entity.RoomImage;
import com.example.staylio_backend.model.enums.ImageStatus;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.repository.RoomImageRepo;
import com.example.staylio_backend.repository.RoomRepo;
import com.example.staylio_backend.service.RoomImageService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class RoomImageServiceImpl implements RoomImageService {
    private final RoomImageRepo roomImageRepo;
    private final RoomRepo roomRepo;
    private final ProfileRepo profileRepo;

    @Override
    public PaginationResponse<RoomImageAdminResponse> getAllImages(String search, Long roomId, ImageStatus status, int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        Page<RoomImage> roomImagePage = roomImageRepo.searchImages(roomId, search, status, pageable);

        List<RoomImageAdminResponse> content = roomImagePage.getContent().stream()
                .map(this::convertToDTO)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                roomImagePage.getNumber() + 1,
                roomImagePage.getSize(),
                roomImagePage.getTotalPages(),
                roomImagePage.getTotalElements()
        );
        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public RoomImageAdminResponse getRoomImageById(Long id) {
        RoomImage roomImage = roomImageRepo.findById(id).orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_IMAGE_NOT_FOUND.getMessage()));
        return convertToDTO(roomImage);
    }

    @Override
    @Transactional
    public void updateStatus(Long id, RoomImageStatusRequest request, UserPrincipal userPrincipal) {
        RoomImage roomImage = roomImageRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.ROOM_IMAGE_NOT_FOUND.getMessage()
                ));

        ImageStatus currentStatus = roomImage.getStatus();
        ImageStatus newStatus = request.getStatus();

        if (currentStatus == ImageStatus.DELETED) {
            throw new AppException(ErrorCode.ROOM_IMAGE_ALREADY_DELETED);
        }

        if (userPrincipal.hasRole(RoleName.ROLE_ADMIN)) {
            handleAdminUpdate(roomImage, request);
            return;
        }

        if (userPrincipal.hasRole(RoleName.ROLE_MANAGER)) {
            handleManagerUpdate(roomImage, newStatus, userPrincipal);
            return;
        }

        throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    public RoomImageAdminResponse convertToDTO(RoomImage roomImage) {
        Room room = roomRepo.findById(roomImage.getRoom().getId()).orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        HotelBranch branch = room.getHotelBranch();

        Profile profile = profileRepo.findById(branch.getHotel().getManager().getId()).orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        return new RoomImageAdminResponse(
                roomImage.getId(),
                roomImage.getImageUrl(),
                room.getId(),
                room.getRoomName(),
                room.getRoomNumber(),
                profile.getFullName(),
                branch.getBranchName(),
                roomImage.getStatus(),
                roomImage.getIsPrimary(),
                roomImage.getIs360(),
                roomImage.getCreatedAt(),
                roomImage.getRejectionReason()
        );
    }

    private Sort getSort(String sortBy, String direction) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String safeSortBy = sortBy == null || sortBy.isBlank()
                ? "createdAt"
                : sortBy;

        String property = switch (safeSortBy) {
            case "hotelBranchName" -> "room.hotelBranch.hotelBranchName";
            case "createdAt" -> "createdAt";
            case "roomNumber" -> "room.roomNumber";
            case "roomName" -> "room.roomName";
            case "ownerName" ->
                    "room.hotelBranch.hotel.manager.fullName";
            case "isPrimary" -> "isPrimary";
            default -> "createdAt";
        };

        return Sort.by(dir, property);
    }

    private void handleAdminUpdate(RoomImage roomImage, RoomImageStatusRequest request) {
        if (roomImage.getStatus() != ImageStatus.PENDING) {
            throw new AppException(ErrorCode.INVALID_IMAGE_STATUS);
        }

        switch (request.getStatus()) {
            case CONFIRMED -> {
                roomImage.setStatus(ImageStatus.CONFIRMED);
                roomImage.setRejectionReason(null);
            }

            case REJECTED -> {
                if (request.getRejectionReason() == null
                        || request.getRejectionReason().isBlank()) {
                    throw new AppException(ErrorCode.REJECTION_REASON_REQUIRED);
                }

                roomImage.setStatus(ImageStatus.REJECTED);
                roomImage.setRejectionReason(request.getRejectionReason().trim());
            }

            default -> throw new AppException(ErrorCode.INVALID_IMAGE_STATUS);
        }
    }

    private void handleManagerUpdate(
            RoomImage roomImage,
            ImageStatus newStatus,
            UserPrincipal userPrincipal
    ) {
        if (newStatus != ImageStatus.DELETED) {
            throw new AppException(ErrorCode.INVALID_IMAGE_STATUS);
        }

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        Long managerId = roomImage.getRoom()
                .getHotelBranch()
                .getHotel()
                .getManager()
                .getId();

        if (!managerId.equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        roomImage.setStatus(ImageStatus.DELETED);
        roomImage.setRejectionReason(null);
    }
}
