package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.request.UserLoginRequest;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.JWTResponse;
import com.example.staylio_backend.model.entity.User;

public interface AuthService {
    User register(UserRegisterRequest userRegisterRequest);

    JWTResponse login(UserLoginRequest userLoginRequest);
}
