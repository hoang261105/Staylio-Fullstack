package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.UserVoucherStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@Table(name = "user_voucher")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class UserVoucher extends BaseObject {
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voucher_id", nullable = false)
    private Voucher voucher;

    @Builder.Default
    @Column(name = "used_count")
    private Integer usedCount = 0;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private UserVoucherStatus status;

    @Column(name = "assigned_at")
    private LocalDateTime assignedAt;

    @Column(name = "used_at")
    private LocalDateTime usedAt;
}
