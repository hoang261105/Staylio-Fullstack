package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.request.NewPasswordRequest;
import com.example.staylio_backend.dto.request.UserLoginRequest;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.JWTResponse;
import com.example.staylio_backend.dto.response.TokenResponse;
import com.example.staylio_backend.model.entity.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public interface AuthService {
    User register(UserRegisterRequest userRegisterRequest);

    JWTResponse login(UserLoginRequest userLoginRequest, HttpServletResponse response);

    void forgotPassword(String email);

    void resetPassword(String token, NewPasswordRequest newPasswordRequest);

    void logout(HttpServletRequest request, HttpServletResponse response);

    TokenResponse authenticateGoogleUser(String idTokenString, HttpServletResponse response) throws Exception;

    String refreshToken(HttpServletRequest request, HttpServletResponse response);
}
