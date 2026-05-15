package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Table(name = "utilities")
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Utility extends BaseObject {
    @Column(name = "title")
    private String title;

    @Column(name = "icon_name")
    private String iconName;

    @Column(name = "description")
    private String description;

    @JsonIgnore
    @ManyToMany(mappedBy = "utilities")
    private Set<Room> rooms;

    @Column(name = "is_deleted")
    private Boolean isDeleted = false;
}
