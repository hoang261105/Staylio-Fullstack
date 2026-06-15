package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.RoomStatus;
import com.example.staylio_backend.model.enums.RoomType;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Getter
@Setter
@Table(
        name = "rooms",
        uniqueConstraints = {
                @UniqueConstraint(
                        name = "uk_room_name_branch",
                        columnNames = {"room_name", "hotel_branch_id"}
                ),
                @UniqueConstraint(
                        name = "uk_room_number_branch",
                        columnNames = {"room_number", "hotel_branch_id"}
                )
        }
)
@Entity
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Room extends BaseObject {
    @Column(name = "room_name", nullable = false)
    private String roomName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hotel_branch_id")
    private HotelBranch hotelBranch;

    @Column(name = "room_type")
    @Enumerated(EnumType.STRING)
    private RoomType roomType;

    @Column(name = "description")
    private String description;

    @Column(name = "price")
    private BigDecimal price;

    @Column(name = "max_adults")
    private Integer maxAdults;

    @Column(name = "max_children")
    private Integer maxChildren;

    @Column(name = "adult_price")
    private BigDecimal adultPrice;

    @Column(name = "capacity")
    private Integer capacity;

    @Column(name = "child_price")
    private BigDecimal childPrice;

    @Column(name = "bed_info", nullable = false)
    private String bedInfo;

    @Column(name = "area", nullable = false)
    private Double area;

    @Column(name = "room_number", nullable = false)
    private String roomNumber;

    @Column(name = "floor")
    private Integer floor;

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @Column(name = "is_active")
    private Boolean isActive;

    @Column(name = "is_voucher_applicable")
    private Boolean isVoucherApplicable;

    @ManyToMany
    @JoinTable(
            name = "room_utility",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "utility_id")
    )
    private Set<Utility> utilities;

    @OneToMany(mappedBy = "room", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<RoomImage> images = new ArrayList<>();

    @Column(name = "traveloka_room_id")
    private String travelokaRoomId;
}
