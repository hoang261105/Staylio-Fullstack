package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.AuditableObject;
import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.ReviewStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(
        name = "reviews",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = "booking_id")
        }
)
@Entity
@Builder
public class Review extends AuditableObject {
    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Profile profile;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "comment", columnDefinition = "TEXT")
    private String comment;

    @Column(name = "reply_comment", columnDefinition = "TEXT")
    private String replyComment;

    @Column(name = "reply_at")
    private LocalDateTime replyAt;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private ReviewStatus status;

    @Column(name = "is_deleted")
    private Boolean isDeleted;
}
