package com.example.staylio_backend.service.impl.admin;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.common.utils.SecurityUtils;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ApprovalStatusRequest;
import com.example.staylio_backend.dto.request.VoucherRequest;
import com.example.staylio_backend.dto.request.VoucherStatusRequest;
import com.example.staylio_backend.dto.response.VoucherResponse;
import com.example.staylio_backend.dto.response.page.PaginationDTO;
import com.example.staylio_backend.dto.response.page.PaginationResponse;
import com.example.staylio_backend.model.entity.HotelBranch;
import com.example.staylio_backend.model.entity.Voucher;
import com.example.staylio_backend.model.enums.ApprovalStatus;
import com.example.staylio_backend.model.enums.DiscountType;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.VoucherScope;
import com.example.staylio_backend.model.enums.VoucherStatus;
import com.example.staylio_backend.repository.HotelBranchRepo;
import com.example.staylio_backend.repository.VoucherRepo;
import com.example.staylio_backend.service.VoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class VoucherServiceImpl implements VoucherService {
    private final VoucherRepo voucherRepo;
    private final HotelBranchRepo branchRepo;

    @Override
    public PaginationResponse<VoucherResponse> getAllVouchers(String search, Long hotelBranchId, int page, int size,
            VoucherStatus status, String sortBy, String direction) {
        Pageable pageable = PageRequest.of(page, size, getSort(sortBy, direction));
        UserPrincipal principal = SecurityUtils.getCurrentUser();

        Page<Voucher> vouchersPage;

        if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            if (hotelBranchId != null) {
                boolean owned = branchRepo.existsByIdAndHotelManagerId(
                        hotelBranchId,
                        principal.getId());

                if (!owned) {
                    throw new AccessDeniedException("Bạn không có quyền xem voucher của chi nhánh này");
                }

                vouchersPage = voucherRepo.searchVouchersByHotelBranchIdAndStatus(hotelBranchId, status, search,
                        pageable);
            } else {
                vouchersPage = voucherRepo.findAllVouchersByManager(principal.getId(), status, search, pageable);
            }
        } else {
            if (hotelBranchId != null) {
                vouchersPage = voucherRepo.searchVouchersByHotelBranchIdAndStatus(hotelBranchId, status, search,
                        pageable);
            } else {
                vouchersPage = voucherRepo.findAllVouchers(status, search, pageable);
            }
        }

        List<VoucherResponse> voucherResponses = vouchersPage.getContent().stream()
                .map(this::convertToResponse)
                .toList();

        PaginationDTO paginationDTO = new PaginationDTO(
                vouchersPage.getNumber() + 1,
                vouchersPage.getSize(),
                vouchersPage.getTotalPages(),
                vouchersPage.getTotalElements());

        return new PaginationResponse<>(voucherResponses, paginationDTO);
    }

    @Override
    public VoucherResponse getVoucherById(Long id, UserPrincipal userPrincipal) {
        Voucher voucher = voucherRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.VOUCHER_NOT_FOUND.getMessage()));

        HotelBranch branch = voucher.getHotelBranch();

        if (!branch.getHotel().getManager().getId().equals(userPrincipal.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        return convertToResponse(voucher);
    }

    @Override
    public VoucherResponse createVoucher(VoucherRequest request, UserPrincipal userPrincipal) {
        String code = request.getCode().trim().toUpperCase();

        boolean isExistCode = voucherRepo.existsByCode(code);

        if (isExistCode) {
            throw new AppException(ErrorCode.VOUCHER_CODE_EXISTED);
        }

        HotelBranch branch = branchRepo.findById(request.getHotelBranchId())
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));

        if (!branch.getHotel().getManager().getId().equals(userPrincipal.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (request.getExpiryDate().isBefore(request.getStartDate())) {
            throw new AppException(ErrorCode.INVALID_VOUCHER_DATE);
        }

        if (request.getDiscountType() == DiscountType.PERCENTAGE
                && request.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new AppException(ErrorCode.INVALID_DISCOUNT_VALUE);
        }

        Voucher voucher = Voucher.builder()
                .code(code)
                .title(request.getTitle())
                .description(request.getDescription())
                .discountType(request.getDiscountType())
                .discountValue(request.getDiscountValue())
                .minOrderValue(request.getMinOrderValue())
                .maxDiscountAmount(
                        request.getDiscountType() == DiscountType.FIXED
                                ? null
                                : request.getMaxDiscountAmount())
                .hotelBranch(branch)
                .totalUsageLimit(request.getTotalUsageLimit())
                .currentUsageCount(0)
                .usageLimitPerUser(request.getUsageLimitPerUser())
                .startDate(request.getStartDate())
                .expiryDate(request.getExpiryDate())
                .status(VoucherStatus.ACTIVE)
                .approvalStatus(ApprovalStatus.PENDING)
                .scope(VoucherScope.ALL_ROOMS)
                .isWelcomeVoucher(request.getIsWelcomeVoucher() != null ? request.getIsWelcomeVoucher() : false)
                .build();

        Voucher savedVoucher = voucherRepo.save(voucher);

        return convertToResponse(savedVoucher);
    }

    @Override
    public VoucherResponse updateVoucher(Long id, VoucherRequest request, UserPrincipal userPrincipal) {
        String code = request.getCode().trim().toUpperCase();
        boolean isExistCode = voucherRepo.existsByCodeAndIdNot(code, id);

        if (isExistCode) {
            throw new AppException(ErrorCode.VOUCHER_CODE_EXISTED);
        }

        HotelBranch branch = branchRepo.findById(request.getHotelBranchId())
                .orElseThrow(() -> new NoSuchElementException(
                        ErrorCode.HOTEL_BRANCH_NOT_FOUND.getMessage()));

        if (!branch.getHotel().getManager().getId().equals(userPrincipal.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (request.getExpiryDate().isBefore(request.getStartDate())) {
            throw new AppException(ErrorCode.INVALID_VOUCHER_DATE);
        }

        if (request.getDiscountType() == DiscountType.PERCENTAGE
                && request.getDiscountValue().compareTo(BigDecimal.valueOf(100)) > 0) {
            throw new AppException(ErrorCode.INVALID_DISCOUNT_VALUE);
        }

        Voucher voucher = voucherRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.VOUCHER_NOT_FOUND.getMessage()));

        voucher.setCode(code);
        voucher.setTitle(request.getTitle());
        voucher.setDescription(request.getDescription());
        voucher.setDiscountType(request.getDiscountType());
        voucher.setDiscountValue(request.getDiscountValue());
        voucher.setMinOrderValue(request.getMinOrderValue());
        voucher.setMaxDiscountAmount(
                request.getDiscountType() == DiscountType.FIXED
                        ? null
                        : request.getMaxDiscountAmount());
        voucher.setHotelBranch(branch);
        voucher.setTotalUsageLimit(request.getTotalUsageLimit());
        voucher.setUsageLimitPerUser(request.getUsageLimitPerUser());
        voucher.setStartDate(request.getStartDate());
        voucher.setExpiryDate(request.getExpiryDate());
        if (voucher.getScope() == null) {
            voucher.setScope(VoucherScope.ALL_ROOMS);
        }
        voucher.setIsWelcomeVoucher(request.getIsWelcomeVoucher() != null ? request.getIsWelcomeVoucher() : false);

        Voucher updatedVoucher = voucherRepo.save(voucher);
        return convertToResponse(updatedVoucher);
    }

    @Override
    public void updateStatus(Long id, VoucherStatusRequest request, UserPrincipal userPrincipal) {
        Voucher voucher = voucherRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.VOUCHER_NOT_FOUND.getMessage()));

        HotelBranch branch = voucher.getHotelBranch();
        if (userPrincipal.getRoleName() == RoleName.ROLE_MANAGER) {
            if (!branch.getHotel().getManager().getId().equals(userPrincipal.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        }

        voucher.setStatus(request.getStatus());
        voucherRepo.save(voucher);
    }

    @Override
    public void updateApprovalStatus(Long id, ApprovalStatusRequest request) {
        Voucher voucher = voucherRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.VOUCHER_NOT_FOUND.getMessage()));
        UserPrincipal principal = SecurityUtils.getCurrentUser();

        if (principal.hasRole(RoleName.ROLE_MANAGER)) {
            if (request.getApprovalStatus() != ApprovalStatus.DELETED) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
            if (!voucher.getHotelBranch().getHotel().getManager().getId().equals(principal.getId())) {
                throw new AppException(ErrorCode.UNAUTHORIZED);
            }
        } else if (!principal.hasRole(RoleName.ROLE_ADMIN)) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        voucher.setApprovalStatus(request.getApprovalStatus());
        voucherRepo.save(voucher);
    }

    public VoucherResponse convertToResponse(Voucher voucher) {
        return new VoucherResponse(
                voucher.getId(),
                voucher.getCode(),
                voucher.getTitle(),
                voucher.getDescription(),
                voucher.getDiscountType(),
                voucher.getDiscountValue(),
                voucher.getMinOrderValue(),
                voucher.getMaxDiscountAmount(),
                voucher.getHotelBranch().getId(),
                voucher.getHotelBranch().getBranchName(),
                voucher.getTotalUsageLimit(),
                voucher.getCurrentUsageCount(),
                voucher.getUsageLimitPerUser(),
                voucher.getStartDate(),
                voucher.getExpiryDate(),
                voucher.getStatus(),
                voucher.getApprovalStatus(),
                voucher.getIsWelcomeVoucher());
    }

    private Sort getSort(String sortBy, String direction) {
        Sort.Direction dir = "desc".equalsIgnoreCase(direction)
                ? Sort.Direction.DESC
                : Sort.Direction.ASC;

        String safeSortBy = sortBy == null || sortBy.isBlank()
                ? "id"
                : sortBy;

        String property = switch (safeSortBy) {
            case "hotelBranchName" -> "hotelBranch.hotelBranchName";
            case "voucherName" -> "voucherName";
            default -> "id";
        };

        return Sort.by(dir, property);
    }
}
