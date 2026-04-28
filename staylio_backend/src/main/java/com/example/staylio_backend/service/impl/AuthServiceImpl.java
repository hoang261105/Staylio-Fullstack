package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.config.security.AppConfig;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.exception.AppException;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.Role;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.ErrorCode;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.UserStatus;
import com.example.staylio_backend.model.enums.VerificationType;
import com.example.staylio_backend.repository.AccountRepo;
import com.example.staylio_backend.repository.RoleRepo;
import com.example.staylio_backend.service.AuthService;
import com.example.staylio_backend.service.EmailService;
import com.example.staylio_backend.service.VerificationService;
import jakarta.mail.MessagingException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AccountRepo accountRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService;
    private final EmailService emailService;
    private final AppConfig appConfig;

    @Override
    public User register(UserRegisterRequest userRegisterRequest) {
        boolean isExistUserName = accountRepo.existsByUserName(userRegisterRequest.getUserName());
        boolean isExistEmail = accountRepo.existsByEmail(userRegisterRequest.getEmail());

        if (isExistUserName) {
            throw new AppException(ErrorCode.USER_EXISTED, "userName");
        }
        if (isExistEmail) {
            throw new AppException(ErrorCode.EMAIL_EXISTED, "email");
        }

        Role defaultRole = roleRepo.findByRoleName(RoleName.CUSTOMER);

        Profile profile = Profile.builder()
                .fullName(userRegisterRequest.getFullName())
                .gender(userRegisterRequest.getGender())
                .avatarUrl("https://i.pinimg.com/236x/5e/e0/82/5ee082781b8c41406a2a50a0f32d6aa6.jpg")
                .dateOfBirth(userRegisterRequest.getDateOfBirth())
                .build();

        User user = User.builder()
                .userName(userRegisterRequest.getUserName())
                .email(userRegisterRequest.getEmail())
                .passwordHash(passwordEncoder.encode(userRegisterRequest.getPassword()))
                .role(defaultRole)
                .profile(profile)
                .status(UserStatus.INACTIVE)
                .isFirstLogin(false)
                .isEmailVerified(false)
                .build();

        User savedUser = accountRepo.save(user);
        String token = verificationService.createVerificationToken(savedUser, VerificationType.VERIFY_EMAIL);

        try {
            String verifyLink = appConfig.getFullApiUrl() + "/auth/verify-registration?token=" + token;

            String content = "<h3>Dear " + savedUser.getUserName() + ",</h3>" +
                    "<p>Thank you for registering an account at Staylio.</p>" +
                    "<p>Please click the button below to activate your account.:</p>" +
                    "<a href='" + verifyLink + "' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>KÍCH HOẠT TÀI KHOẢN</a>" +
                    "<p>This link will expire in 1 hours.</p>";

            emailService.sendHtmlMail(savedUser.getEmail(), "Xác thực tài khoản của bạn", content);
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.CANNOT_SEND_EMAIL);
        }

        return savedUser;
    }
}
