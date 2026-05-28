package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.DiscountType;
import com.example.staylio_backend.model.enums.VoucherScope;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
    public class ApplicableVoucherResponse {
    private Long userVoucherId;
    private Long voucherId;

    private String code;
    private String title;
    private String description;

    private DiscountType discountType;
    private BigDecimal discountValue;

    private BigDecimal minOrderValue;
    private BigDecimal maxDiscountAmount;

    private BigDecimal discountPreview;

    private LocalDateTime startDate;
    private LocalDateTime expiryDate;
    private VoucherScope scope;
    private Boolean isUsed;
}
