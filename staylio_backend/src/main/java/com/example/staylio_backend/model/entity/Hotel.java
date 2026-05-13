package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.HotelStatus;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;

@Table(name = "hotels")
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Hotel extends BaseObject {
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "image_url")
    private String imageUrl;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "manager_id")
    private Profile manager;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private HotelStatus status;

    @Column(name = "is_active")
    private boolean isActive;
}
