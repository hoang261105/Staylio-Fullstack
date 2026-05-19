package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.DiscountType;
import com.example.staylio_backend.model.enums.VoucherStatus;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "voucher")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Voucher extends BaseObject {
    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(name = "discount_type", nullable = false)
    private DiscountType discountType;

    @Column(name = "discount_value", nullable = false)
    private BigDecimal discountValue;

    @Column(name = "min_order_value")
    private BigDecimal minOrderValue;

    @Column(name = "max_discount_amount")
    private BigDecimal maxDiscountAmount;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_branch_id")
    private HotelBranch hotelBranch;

    @Column(name = "total_usage_limit")
    private Integer totalUsageLimit;

    @Builder.Default
    @Column(name = "current_usage_count")
    private Integer currentUsageCount = 0;

    @Column(name = "usage_limit_per_user")
    private Integer usageLimitPerUser;

    @Column(name = "start_date")
    private LocalDateTime startDate;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private VoucherStatus status;
}
