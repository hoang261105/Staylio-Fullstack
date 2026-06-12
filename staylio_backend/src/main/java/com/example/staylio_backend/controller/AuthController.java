package com.example.staylio_backend.controller;

import com.example.staylio_backend.dto.request.*;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.JWTResponse;
import com.example.staylio_backend.dto.response.TokenResponse;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.VerificationType;
import com.example.staylio_backend.service.AuthService;
import com.example.staylio_backend.service.VerificationService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
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
                        "Xác thực đăng kí thành công!"));
    }

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập tài khoản")
    public ResponseEntity<ApiResponse<JWTResponse>> login(@Valid @RequestBody UserLoginRequest userLoginRequest,
            HttpServletResponse response) {
        JWTResponse loginResponse = authService.login(userLoginRequest, response);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success(loginResponse, "Đăng nhập thành công!"));
    }

    @GetMapping("/forgot-password")
    @Operation(summary = "Quên mật khẩu")
    public ResponseEntity<ApiResponse<String>> forgotPassword(@RequestParam String email) {
        authService.forgotPassword(email);
        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Liên kết đặt lại mật khẩu đã được gửi đến email của bạn!"));
    }

    @GetMapping("/reset-password")
    @Operation(summary = "Verify reset password")
    public ResponseEntity<ApiResponse<String>> resetPassword(@RequestParam("token") String token) {
        verificationService.validateToken(token, VerificationType.RESET_PASSWORD);
        return ResponseEntity.ok(ApiResponse.success(token, "Token hợp lệ, bạn có thể thay đổi mật khẩu!"));
    }

    @PatchMapping("/reset-password")
    @Operation(summary = "Đặt lại mật khẩu")
    public ResponseEntity<ApiResponse<String>> resetPassword(
            @RequestParam("token") String token,
            @Valid @RequestBody NewPasswordRequest newPasswordRequest) {
        authService.resetPassword(token, newPasswordRequest);
        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Mật khẩu đã được thay đổi thành công!"));
    }

    @PostMapping("/refresh-token")
    @Operation(summary = "Cấp mới refresh-token")
    public ResponseEntity<?> refreshToken(HttpServletRequest request,
            HttpServletResponse response) {

        authService.refreshToken(request, response);
        return ResponseEntity.ok("Refresh thành công!");
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất tài khoản")
    public ResponseEntity<ApiResponse<String>> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok(ApiResponse.success(
                null,
                "Đăng xuất thành công!"));
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse<TokenResponse>> googleLogin(@RequestBody GoogleLoginRequest request,
            HttpServletResponse response) throws Exception {
        TokenResponse token = authService.authenticateGoogleUser(request.getIdToken(), response);

        return ResponseEntity.status(HttpStatus.OK).body(ApiResponse.success(
                token,
                "Đăng nhập băng google thành công!"));
    }
}
