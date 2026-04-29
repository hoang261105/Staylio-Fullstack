package com.example.staylio_backend.controller.auth;

import com.example.staylio_backend.dto.request.UserLoginRequest;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.JWTResponse;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.VerificationType;
import com.example.staylio_backend.service.AuthService;
import com.example.staylio_backend.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;
    private final VerificationService verificationService;

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản")
    public ResponseEntity<ApiResponse<User>> register(@Valid @RequestBody UserRegisterRequest userRegisterRequest) {
        User newUser = authService.register(userRegisterRequest);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(newUser, "Đăng ký thành công!"));
    }

    @GetMapping("/verify-registration")
    @Operation(summary = "Xác thực đăng kí tài khoản")
    public ResponseEntity<ApiResponse<String>> verifyRegistration(@RequestParam("token") String token) {
        verificationService.verifyEmail(token);
        return ResponseEntity.ok(
            ApiResponse.success(
                null,
                    "Xác thực đăng kí thành công!"
            )
        );
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập tài khoản")
    public ResponseEntity<ApiResponse<JWTResponse>> login(@Valid @RequestBody UserLoginRequest userLoginRequest) {
        JWTResponse loginResponse = authService.login(userLoginRequest);
        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(loginResponse, "Đăng nhập thành công!"));
    }

    @GetMapping("/forgot-password")
    @Operation(summary = "Quên mật khẩu")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.success(
            null,
            "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!"
        ));
    }
}
