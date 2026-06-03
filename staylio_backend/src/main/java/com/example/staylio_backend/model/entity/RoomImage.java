package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.ImageStatus;
import jakarta.persistence.*;
import lombok.*;

@Getter
@Setter
@Entity
@Table(name = "room_images")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RoomImage extends BaseObject {
    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(name = "is_primary")
    private Boolean isPrimary;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ImageStatus status;

    @Column(name = "rejection_reason")
    private String rejectionReason;
}
