package com.example.staylio_backend.service.impl.admin.helper;

import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.dto.request.BookingRequest;
import com.example.staylio_backend.model.entity.*;
import com.example.staylio_backend.model.enums.*;
import com.example.staylio_backend.repository.UserVoucherRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class BookingValidationService {

    private final UserVoucherRepo userVoucherRepo;

    public void validateBookingRequest(BookingRequest request, Room room) {
        if (request.getCheckInDate() == null || request.getCheckOutDate() == null) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }

        if (!request.getCheckOutDate().isAfter(request.getCheckInDate())) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }

        if (request.getCheckInDate().isBefore(LocalDate.now())) {
            throw new AppException(ErrorCode.INVALID_BOOKING_DATE);
        }

        if (request.getAdults() == null || request.getAdults() <= 0) {
            throw new AppException(ErrorCode.INVALID_NUMBER_OF_GUESTS);
        }

        int children = request.getChildren() == null ? 0 : request.getChildren();

        if (request.getAdults() > room.getMaxAdults()) {
            throw new AppException(ErrorCode.EXCEED_MAX_ADULTS);
        }

        if (children > room.getMaxChildren()) {
            throw new AppException(ErrorCode.EXCEED_MAX_CHILDREN);
        }

        if (request.getAdults() + children > room.getCapacity()) {
            throw new AppException(ErrorCode.EXCEED_ROOM_CAPACITY);
        }
    }

    public UserVoucher validateVoucher(Long userVoucherId, User user, Room room) {
        UserVoucher userVoucher = userVoucherRepo.findById(userVoucherId)
                .orElseThrow(() -> new NoSuchElementException(ErrorCode.USER_VOUCHER_NOT_FOUND.getMessage()));

        if (!userVoucher.getUser().getId().equals(user.getId())) {
            throw new AppException(ErrorCode.UNAUTHORIZED);
        }

        if (room.getIsVoucherApplicable() != null && !room.getIsVoucherApplicable()) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPLICABLE_FOR_ROOM);
        }

        if (userVoucher.getStatus() != UserVoucherStatus.UNUSED) {
            throw new AppException(ErrorCode.USER_VOUCHER_INVALID);
        }

        Voucher voucher = userVoucher.getVoucher();

        if (voucher.getStatus() != VoucherStatus.ACTIVE) {
            throw new AppException(ErrorCode.VOUCHER_NOT_ACTIVE);
        }

        if (voucher.getApprovalStatus() != ApprovalStatus.CONFIRMED) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPROVED);
        }

        LocalDateTime now = LocalDateTime.now();

        if (voucher.getStartDate() != null && now.isBefore(voucher.getStartDate())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_STARTED);
        }

        if (voucher.getExpiryDate() != null && now.isAfter(voucher.getExpiryDate())) {
            throw new AppException(ErrorCode.VOUCHER_EXPIRED);
        }

        if (voucher.getHotelBranch() != null
                && !Boolean.TRUE.equals(voucher.getIsWelcomeVoucher())
                && !voucher.getHotelBranch().getId()
                        .equals(room.getHotelBranch().getId())) {
            throw new AppException(ErrorCode.VOUCHER_NOT_APPLICABLE_FOR_BRANCH);
        }

        if (voucher.getTotalUsageLimit() != null
                && voucher.getCurrentUsageCount() >= voucher.getTotalUsageLimit()) {
            throw new AppException(ErrorCode.VOUCHER_USAGE_LIMIT_EXCEEDED);
        }

        if (voucher.getUsageLimitPerUser() != null
                && userVoucher.getUsedCount() >= voucher.getUsageLimitPerUser()) {
            throw new AppException(ErrorCode.USER_VOUCHER_USAGE_LIMIT_EXCEEDED);
        }

        return userVoucher;
    }
}
