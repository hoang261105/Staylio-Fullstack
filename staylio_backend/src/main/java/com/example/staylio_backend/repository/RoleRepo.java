package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.Role;
import com.example.staylio_backend.model.enums.RoleName;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RoleRepo extends JpaRepository<Role, Long> {
    Role findByRoleName(RoleName roleName);
}
