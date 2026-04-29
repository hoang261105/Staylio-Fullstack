package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.RoleName;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AccountRepo extends JpaRepository<User,Long> {
    @Query("""
       select distinct a from User a
       left join fetch a.role r
       where a.email = :email
    """)
    Optional<User> findByEmailWithRoles(@Param("email") String email);

    Optional<User> findByEmail(String email);
    boolean existsByUserName(String userName);
    boolean existsByEmail(String email);
    boolean existsByEmailAndIdNot(String email, Long id);

    Page<User> findByRole_RoleNameIn(List<RoleName> roleNames, Pageable pageable);
}
