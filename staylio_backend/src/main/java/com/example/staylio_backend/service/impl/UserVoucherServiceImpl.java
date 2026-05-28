package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.response.ApplicableVoucherResponse;
import com.example.staylio_backend.model.entity.Room;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.entity.UserVoucher;
import com.example.staylio_backend.model.entity.Voucher;
import com.example.staylio_backend.model.enums.DiscountType;
import com.example.staylio_backend.repository.RoomRepo;
import com.example.staylio_backend.repository.UserRepo;
import com.example.staylio_backend.repository.UserVoucherRepo;
import com.example.staylio_backend.service.UserVoucherService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class UserVoucherServiceImpl implements UserVoucherService {
    private final UserVoucherRepo userVoucherRepo;
    private final UserRepo userRepo;
    private final RoomRepo roomRepo;

    @Override
    public List<ApplicableVoucherResponse> getApplicableVouchers(Long roomId, LocalDate checkInDate, LocalDate checkOutDate, UserPrincipal principal) {
        User user = userRepo.findById(principal.getId())
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_NOT_FOUND.getMessage()));

        Room room = roomRepo.findById(roomId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.ROOM_NOT_FOUND.getMessage()));

        BigDecimal originalPrice = null;

        if (checkInDate != null && checkOutDate != null && checkOutDate.isAfter(checkInDate)) {
            long nights = ChronoUnit.DAYS.between(checkInDate, checkOutDate);
            originalPrice = room.getPrice().multiply(BigDecimal.valueOf(nights));
        }

        List<UserVoucher> userVouchers =
                userVoucherRepo.findApplicableUserVouchers(
                        user.getId(),
                        room.getHotelBranch().getId(),
                        room.getId(),
                        originalPrice
                );

        BigDecimal finalOriginalPrice = originalPrice;

        return userVouchers.stream()
                .map(uv -> convertToApplicableVoucherResponse(uv, finalOriginalPrice))
                .toList();
    }

    private ApplicableVoucherResponse convertToApplicableVoucherResponse(
            UserVoucher userVoucher,
            BigDecimal originalPrice
    ) {
        Voucher voucher = userVoucher.getVoucher();
        
        boolean isUsed = userVoucher.getStatus() == com.example.staylio_backend.model.enums.UserVoucherStatus.USED || 
                         (voucher.getUsageLimitPerUser() != null && userVoucher.getUsedCount() >= voucher.getUsageLimitPerUser());

        BigDecimal discountPreview = BigDecimal.ZERO;

        if (originalPrice != null) {
            discountPreview = calculateDiscountPreview(originalPrice, voucher);
        }

        return ApplicableVoucherResponse.builder()
                .userVoucherId(userVoucher.getId())
                .voucherId(voucher.getId())
                .code(voucher.getCode())
                .title(voucher.getTitle())
                .description(voucher.getDescription())
                .discountType(voucher.getDiscountType())
                .discountValue(voucher.getDiscountValue())
                .minOrderValue(voucher.getMinOrderValue())
                .maxDiscountAmount(voucher.getMaxDiscountAmount())
                .discountPreview(discountPreview)
                .startDate(voucher.getStartDate())
                .expiryDate(voucher.getExpiryDate())
                .scope(voucher.getScope())
                .isUsed(isUsed)
                .build();
    }

    private BigDecimal calculateDiscountPreview(
            BigDecimal originalPrice,
            Voucher voucher
    ) {
        if (voucher.getMinOrderValue() != null
                && originalPrice.compareTo(voucher.getMinOrderValue()) < 0) {
            return BigDecimal.ZERO;
        }

        BigDecimal discountAmount;

        if (voucher.getDiscountType() == DiscountType.PERCENTAGE) {
            discountAmount = originalPrice
                    .multiply(voucher.getDiscountValue())
                    .divide(BigDecimal.valueOf(100), 2, RoundingMode.HALF_UP);
        } else {
            discountAmount = voucher.getDiscountValue();
        }

        if (voucher.getMaxDiscountAmount() != null
                && discountAmount.compareTo(voucher.getMaxDiscountAmount()) > 0) {
            discountAmount = voucher.getMaxDiscountAmount();
        }

        if (discountAmount.compareTo(originalPrice) > 0) {
            discountAmount = originalPrice;
        }

        return discountAmount;
    }
}
