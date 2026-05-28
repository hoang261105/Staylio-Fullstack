package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.BranchStatusRequest;
import com.example.staylio_backend.dto.request.HotelBranchRequest;
import com.example.staylio_backend.dto.request.HotelIdRequest;
import com.example.staylio_backend.dto.request.NotificationRequest;
import com.example.staylio_backend.dto.response.HotelBranchResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.BranchStatus;
import com.example.staylio_backend.model.enums.HotelStatus;
import com.example.staylio_backend.model.enums.NotificationType;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.repository.*;
import com.example.staylio_backend.service.HotelBranchService;
import com.example.staylio_backend.service.NotificationService;
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
public class HotelBranchServiceImpl implements HotelBranchService {
    private final HotelBranchRepo branchRepo;
    private final WardRepo wardRepo;
    private final ProfileRepo profileRepo;
    private final HotelRepo hotelRepo;
    private final NotificationService notificationService;
    private final ReviewRepo reviewRepo;

    @Override
    public PaginationResponse<HotelBranchResponse> getHotelBranches(Long hotelId, String search, BranchStatus status,
            int page, int size, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));

        Page<HotelBranch> branchPage = branchRepo.searchBranches(hotelId, search, status, pageable);

        List<HotelBranchResponse> content = branchPage.getContent().stream()
                .map(this::convertToDTO)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                branchPage.getNumber() + 1,
                branchPage.getSize(),
                branchPage.getTotalPages(),
                branchPage.getTotalElements());
        return new PaginationResponse<>(content, paginationDTO);
    }

    @Override
    public HotelBranchResponse getHotelBranchById(Long id, UserPrincipal userPrincipal) {
        HotelBranch branch = branchRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy chi nhánh khách sạn!"));

        if (userPrincipal == null) {
            return convertToDTO(branch);
        }

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        RoleName role = profile.getUser().getRole().getRoleName();

        if (role == RoleName.ROLE_ADMIN || role == RoleName.ROLE_CUSTOMER) {
            return convertToDTO(branch);
        }

        if (role == RoleName.ROLE_MANAGER) {
            Long managerId = branch.getHotel().getManager().getId();

            if (!managerId.equals(profile.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }

            return convertToDTO(branch);
        }

        throw new AppException(ErrorCode.UNAUTHORIZED);
    }

    @Override
    public void updateStatus(Long id, BranchStatusRequest request) {
        HotelBranch hotelBranch = branchRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy chi nhánh khách sạn!"));

        Long managerId = hotelBranch.getHotel().getManager().getId();

        if (hotelBranch.getStatus() == BranchStatus.CONFIRMED) {
            if (request.getStatus() == BranchStatus.DELETED || request.getStatus() == BranchStatus.REJECTED) {
                throw new AppException(ErrorCode.ILLEGAL_STATUS_TRANSITION);
            }
        }

        if (hotelBranch.getStatus() == BranchStatus.REJECTED) {
            if (request.getStatus() == BranchStatus.CONFIRMED) {
                throw new AppException(ErrorCode.CANNOT_MODIFY_TERMINAL_STATE);
            }
        }

        if (request.getStatus() == BranchStatus.CONFIRMED) {
            notificationService.create(
                    NotificationRequest.builder()
                            .senderId(2L)
                            .receiverId(managerId)
                            .title("Chi nhánh mới đã duyệt")
                            .content("Chi nhánh " + hotelBranch.getBranchName() + " của bạn đã được admin duyệt.")
                            .type(NotificationType.HOTEL_BRANCH_CONFIRMED)
                            .referenceId(hotelBranch.getId())
                            .build()
            );
        } else if (request.getStatus() == BranchStatus.REJECTED) {
            notificationService.create(
                    NotificationRequest.builder()
                            .senderId(managerId)
                            .receiverId(2L)
                            .title("Chi nhánh mới đã từ chối")
                            .content("Chi nhánh " + hotelBranch.getBranchName() + " của bạn đã bị admin từ chối.")
                            .type(NotificationType.HOTEL_BRANCH_REJECTED)
                            .referenceId(hotelBranch.getId())
                            .build()
            );
        }

        hotelBranch.setStatus(request.getStatus());
        branchRepo.save(hotelBranch);
    }

    @Override
    public HotelBranchResponse addBranch(UserPrincipal userPrincipal, HotelBranchRequest request) {
        boolean isExistBranchName = branchRepo.existsByBranchNameAndHotel_Id(request.getBranchName(),
                request.getHotelId());
        boolean isExistPhone = branchRepo.existsByPhone(request.getPhone());

        if (isExistPhone) {
            throw new AppException(ErrorCode.PHONE_EXISTED, "phone");
        }

        if (isExistBranchName) {
            throw new AppException(ErrorCode.BRANCH_NAME_EXISTED, "branchName");
        }

        Hotel hotel = hotelRepo.findById(request.getHotelId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thương hiệu khách sạn!"));

        if (hotel.getStatus() != HotelStatus.CONFIRMED) {
            throw new AppException(ErrorCode.CANNOT_CREATE_BRAND_HOTEL);
        }

        Ward ward = wardRepo.findById(request.getWardId())
                .orElseThrow(() -> new NoSuchElementException("Khong tìm thấy xã/phường tương ứng!"));

        Profile profile = profileRepo.findById(userPrincipal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        if (!hotel.getManager().getId().equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        HotelBranch hotelBranch = HotelBranch.builder()
                .branchName(request.getBranchName())
                .hotel(hotel)
                .ward(ward)
                .imageUrl(request.getImageUrl())
                .address(request.getAddress())
                .capacity(request.getCapacity())
                .status(BranchStatus.PENDING)
                .isActive(true)
                .description(request.getDescription())
                .phone(request.getPhone())
                .build();

        HotelBranch savedBranch = branchRepo.save(hotelBranch);

        notificationService.create(
                NotificationRequest.builder()
                        .senderId(profile.getId())
                        .receiverId(2L)
                        .title("Chi nhánh mới chờ duyệt")
                        .content("Chi nhánh " + savedBranch.getBranchName() + " đang chờ admin duyệt.")
                        .type(NotificationType.HOTEL_BRANCH_CREATED)
                        .referenceId(savedBranch.getId())
                        .build()
        );

        return convertToDTO(savedBranch);
    }

    @Override
    public HotelBranchResponse updateBranch(Long id, UserPrincipal principal, HotelBranchRequest request) {
        boolean isExistBranchName = branchRepo.existsByBranchNameAndHotel_IdAndIdNot(request.getBranchName(),
                request.getHotelId(), id);
        boolean isExistPhone = branchRepo.existsByPhoneAndIdNot(request.getPhone(), id);

        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        Hotel hotel = hotelRepo.findById(request.getHotelId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thương hiệu khách sạn!"));

        if (!hotel.getManager().getId().equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (isExistBranchName) {
            throw new AppException(ErrorCode.BRANCH_NAME_EXISTED, "branchName");
        }

        if (isExistPhone) {
            throw new AppException(ErrorCode.PHONE_EXISTED, "phone");
        }

        HotelBranch branch = branchRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));
        Ward ward = wardRepo.findById(request.getWardId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.WARD_NOT_FOUND.getMessage()));

        branch.setBranchName(request.getBranchName());
        branch.setAddress(request.getAddress());
        branch.setCapacity(request.getCapacity());
        branch.setImageUrl(request.getImageUrl());
        branch.setPhone(request.getPhone());
        branch.setWard(ward);
        branch.setDescription(request.getDescription());
        branch.setActive(true);

        HotelBranch updatedBranch = branchRepo.save(branch);
        return convertToDTO(updatedBranch);
    }

    @Override
    public void deleteStatus(Long id, HotelIdRequest request, UserPrincipal principal) {
        HotelBranch branch = branchRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));

        Profile profile = profileRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        Hotel hotel = hotelRepo.findById(request.getHotelId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy thương hiệu khách sạn!"));

        if (!hotel.getManager().getId().equals(profile.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (branch.getStatus() == BranchStatus.CONFIRMED) {
            throw new AppException(ErrorCode.CANNOT_DELETE_BRANCH);
        }

        branch.setStatus(BranchStatus.DELETED);
        branchRepo.save(branch);
    }

    @Override
    public List<HotelBranchResponse> getAllBranchesByHotelId(Long hotelId, BranchStatus status, UserPrincipal principal) {
        Hotel hotel = hotelRepo.findById(hotelId)
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.HOTEL_BRAND_NOT_FOUND.getMessage()
                ));

        if (principal != null && principal.hasRole(RoleName.ROLE_MANAGER)) {
            Profile profile = profileRepo.findById(principal.getId())
                    .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

            if (!hotel.getManager().getId().equals(profile.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        List<HotelBranch> branches = branchRepo.findAllByHotel_IdAndStatus(hotelId, status);
        return branches.stream().map(this::convertToDTO).toList();
    }

    public HotelBranchResponse convertToDTO(HotelBranch hotelBranch) {
        Ward ward = wardRepo.findById(hotelBranch.getWard().getId())
                .orElseThrow(() -> new RuntimeException("Ward not found"));
        Long countReview = reviewRepo.countReviewsByBranchId(hotelBranch.getId());
        Double averageRating = reviewRepo.averageRatingByBranchId(hotelBranch.getId());

        return HotelBranchResponse.builder()
                .id(hotelBranch.getId())
                .provinceId(ward.getProvince().getId())
                .wardId(ward.getId())
                .hotelBranchName(hotelBranch.getBranchName())
                .hotelId(hotelBranch.getHotel().getId())
                .hotelName(hotelBranch.getHotel().getName())
                .imageUrl(hotelBranch.getImageUrl())
                .address(hotelBranch.getAddress())
                .provinceName(ward.getProvince().getProvince())
                .wardName(hotelBranch.getWard().getName())
                .capacity(hotelBranch.getCapacity())
                .status(hotelBranch.getStatus())
                .description(hotelBranch.getDescription())
                .phone(hotelBranch.getPhone())
                .countReview(countReview)
                .averageRating(roundRating(averageRating))
                .build();
    }

    private Sort getSort(String sortBy, String direction) {
        if (sortBy == null || sortBy.isEmpty()) {
            return Sort.by("id").descending();
        }

        String property = sortBy.equals("fullName") ? "manager.fullName" : sortBy;

        return direction.equalsIgnoreCase("desc") ? Sort.by(property).descending() : Sort.by(property).ascending();
    }

    private Double roundRating(Double rating) {
        if (rating == null) {
            return 0.0;
        }

        return Math.round(rating * 10.0) / 10.0;
    }

}
