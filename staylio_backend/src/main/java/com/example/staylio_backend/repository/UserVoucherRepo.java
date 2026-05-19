package com.example.staylio_backend.repository;

import com.example.staylio_backend.model.entity.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserVoucherRepo extends JpaRepository<UserVoucher, Long> {
}
