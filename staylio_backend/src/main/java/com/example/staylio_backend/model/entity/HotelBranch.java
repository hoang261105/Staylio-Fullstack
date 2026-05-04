package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.AuditableObject;
import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.BranchStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "hotel_branchs")
@Entity
public class HotelBranch extends AuditableObject {
    @Column(name = "branch_name")
    private String branchName;

    @Column(name = "address")
    private String address;

    @Column(name = "image_url")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ward_id")
    private Ward ward;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private BranchStatus status;
}
