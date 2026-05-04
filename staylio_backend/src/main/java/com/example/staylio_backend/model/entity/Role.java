package com.example.staylio_backend.model.entity;

import com.example.staylio_backend.common.base.BaseObject;
import com.example.staylio_backend.model.enums.RoleName;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
public class Role extends BaseObject {
    @Enumerated(EnumType.STRING)
    @Column(name = "role_name", nullable = false)
    private RoleName roleName;
}
