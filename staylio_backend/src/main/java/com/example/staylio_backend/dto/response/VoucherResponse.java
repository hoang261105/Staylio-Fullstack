package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.ApprovalStatus;
import com.example.staylio_backend.model.enums.DiscountType;
import com.example.staylio_backend.model.enums.VoucherStatus;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VoucherResponse {
    private Long id;
    private String code;
    private String title;
    private String description;
    private DiscountType discountType;
    private BigDecimal discountValue;
    private BigDecimal minOrderValue;
    private BigDecimal maxDiscountAmount;
    private Long hotelBranchId;
    private String hotelBranchName;
    private Integer totalUsageLimit;
    private Integer currentUsageCount;
    private Integer usageLimitPerUser;
    private LocalDateTime startDate;
    private LocalDateTime expiryDate;
    private VoucherStatus status;
    private ApprovalStatus approvalStatus;
    private Boolean isWelcomeVoucher;
}
