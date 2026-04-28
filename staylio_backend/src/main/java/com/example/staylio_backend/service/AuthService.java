package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.model.entity.User;

public interface AuthService {
    User register(UserRegisterRequest userRegisterRequest);
}
