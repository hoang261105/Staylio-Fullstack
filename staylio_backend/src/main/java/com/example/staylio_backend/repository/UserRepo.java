package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.UserStatus;
import io.lettuce.core.dynamic.annotation.Param;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepo extends JpaRepository<User, Long> {
    @Modifying
    @Transactional
    @Query("UPDATE User u SET u.status = :status WHERE u.id IN :ids")
    void updateStatusByIds(@Param("ids") List<Long> ids, @Param("status") UserStatus status);

    List<User> findAllByIdIn(List<Long> ids);
}
