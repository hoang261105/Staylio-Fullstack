package com.example.staylio_backend.service.impl.auth;

import com.example.staylio_backend.config.security.jwt.JwtTokenProvider;
import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.NewPasswordRequest;
import com.example.staylio_backend.dto.request.UserLoginRequest;
import com.example.staylio_backend.dto.request.UserRegisterRequest;
import com.example.staylio_backend.dto.response.JWTResponse;
import com.example.staylio_backend.dto.response.TokenResponse;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.model.auth.BlacklistToken;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.Role;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.entity.VerificationToken;
import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.UserStatus;
import com.example.staylio_backend.model.enums.VerificationType;
import com.example.staylio_backend.repository.*;
import com.example.staylio_backend.service.AuthService;
import com.example.staylio_backend.service.EmailService;
import com.example.staylio_backend.service.VerificationService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.NoSuchElementException;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {
    private final AccountRepo accountRepo;
    private final RoleRepo roleRepo;
    private final PasswordEncoder passwordEncoder;
    private final VerificationService verificationService;
    private final VerificationTokenRepo verificationTokenRepo;
    private final EmailService emailService;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final RedisTemplate<String, String> redisTemplate;
    private final BlacklistTokenRepo blacklistTokenRepo;
    private final ProfileRepo profileRepo;

    @Value(value = "${spring.security.oauth2.client.registration.google.client-id}")
    private String googleClientId;

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

        Role defaultRole = roleRepo.findByRoleName(RoleName.ROLE_CUSTOMER);

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
                .isFirstLogin(true)
                .isEmailVerified(false)
                .build();

        profile.setUser(user);
        user.setProfile(profile);

        User savedUser = accountRepo.save(user);
        String token = verificationService.createVerificationToken(savedUser, VerificationType.VERIFY_EMAIL);

        try {
            String verifyLink = "http://localhost:3002/verify-email?token=" + token;

            String content = "<h3>Dear " + savedUser.getUserName() + ",</h3>" +
                    "<p>Thank you for registering an account at Staylio.</p>" +
                    "<p>Please click the button below to activate your account.:</p>" +
                    "<a href='" + verifyLink
                    + "' style='background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;'>KÍCH HOẠT TÀI KHOẢN</a>"
                    +
                    "<p>This link will expire in 1 hours.</p>";

            emailService.sendHtmlMail(savedUser.getEmail(), "Xác thực tài khoản của bạn", content);
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.CANNOT_SEND_EMAIL);
        }

        return savedUser;
    }

    @Override
    public JWTResponse login(UserLoginRequest userLoginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            userLoginRequest.getEmail(),
                            userLoginRequest.getPassword()));

            SecurityContextHolder.getContext().setAuthentication(authentication);

            UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();

            String accessToken = jwtTokenProvider.generateAccessToken(principal);
            String refreshToken = jwtTokenProvider.generateRefreshToken(principal);

            return JWTResponse.builder()
                    .id(principal.getId())
                    .email(principal.getEmail())
                    .fullName(principal.getFullName())
                    .phone(principal.getPhone())
                    .address(principal.getAddress())
                    .avatarUrl(principal.getAvatarUrl())
                    .gender(principal.isGender())
                    .status(principal.getUserStatus())
                    .dateOfBirth(principal.getDateOfBirth())
                    .authorities(principal.getAuthorities())
                    .accessToken(accessToken)
                    .refreshToken(refreshToken)
                    .build();
        } catch (BadCredentialsException e) {
            throw new AppException(ErrorCode.INVALID_PASSWORD_OR_EMAIL, "password");
        } catch (LockedException e) {
            throw new AppException(ErrorCode.ACCOUNT_LOCKED);
        } catch (AuthenticationException e) {
            throw new AppException(ErrorCode.UNAUTHENTICATED);
        }
    }

    @Override
    public void forgotPassword(String email) {
        User optionalUser = accountRepo.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Không tim thấy email!"));

        try {
            String token = verificationService.createVerificationToken(optionalUser, VerificationType.RESET_PASSWORD);

            String resetLink = "http://localhost:3002/reset-password?token=" + token;

            String content = "<p>You have requested a password reset. Please click the link below:</p>" +
                    "<a href='" + resetLink + "'>RESET PASSWORD</a>";

            emailService.sendHtmlMail(email, "Password reset request", content);
        } catch (MessagingException e) {
            throw new AppException(ErrorCode.CANNOT_SEND_EMAIL);
        }
    }

    @Override
    public void resetPassword(String token, NewPasswordRequest newPasswordRequest) {
        VerificationToken verificationToken = verificationService.validateToken(token, VerificationType.RESET_PASSWORD);

        if (!newPasswordRequest.getNewPassword().equals(newPasswordRequest.getConfirmNewPassword())) {
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        User user = verificationToken.getUser();
        user.setPasswordHash(passwordEncoder.encode(newPasswordRequest.getNewPassword()));
        accountRepo.save(user);
        verificationToken.setConsumedAt(LocalDateTime.now());
        verificationTokenRepo.save(verificationToken);
    }

    @Override
    public void logout(String accessToken, String refreshToken) {
        verificationTokenRepo.deleteByTokenAndType(refreshToken, VerificationType.REFRESH_TOKEN);

        long remainingTime = jwtTokenProvider.getRemainingTime(accessToken);

        if (remainingTime > 0) {
            redisTemplate.opsForValue().set(
                    accessToken,
                    "blacklisted",
                    remainingTime,
                    TimeUnit.MILLISECONDS);
        }

        BlacklistToken blToken = new BlacklistToken();
        blToken.setToken(accessToken);
        blToken.setExpiredDate(jwtTokenProvider.getExpiryDateFromToken(accessToken));
        blacklistTokenRepo.save(blToken);
    }

    @Transactional
    @Override
    public TokenResponse authenticateGoogleUser(String idTokenString) throws Exception {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                .setAudience(Collections.singletonList(googleClientId)).build();

        GoogleIdToken idToken = verifier.verify(idTokenString);

        if (idToken == null) {
            throw new RuntimeException("Token không hợp lệ!");
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        if (!payload.getEmailVerified()) {
            throw new RuntimeException("Email chưa xác thực!");
        }

        String email = payload.getEmail();

        User user = accountRepo.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setUserName(email.split("@")[0]);
            newUser.setStatus(UserStatus.ACTIVE);
            newUser.setIsEmailVerified(true);
            newUser.setIsFirstLogin(true);
            newUser.setRole(
                    roleRepo.findByRoleName(RoleName.ROLE_CUSTOMER));

            User savedUser = accountRepo.save(newUser);

            Profile profile = new Profile();
            profile.setUser(savedUser); // MapsId
            profile.setFullName((String) payload.get("name"));
            profile.setAvatarUrl((String) payload.get("picture"));

            profileRepo.save(profile);

            return savedUser;
        });

        return generateTokenResponse(user);
    }

    @Override
    public String refreshToken(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = null;

        if (request.getCookies() != null) {
            for (Cookie cookie : request.getCookies()) {
                if ("refreshToken".equals(cookie.getName())) {
                    refreshToken = cookie.getValue();
                }
            }
        }

        if (refreshToken == null || refreshToken.isEmpty()) {
            refreshToken = request.getHeader("Refresh-Token");
        }

        if (refreshToken == null || refreshToken.isEmpty()) {
            throw new RuntimeException("Refresh token không tồn tại");
        }

        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Refresh token không hợp lệ");
        }

        String email = jwtTokenProvider.getEmailFromToken(refreshToken);

        User user = accountRepo.findByEmail(email)
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy user"));

        if (user.getStatus() != UserStatus.ACTIVE) {
            throw new RuntimeException("User không hợp lệ");
        }

        UserPrincipal principal = UserPrincipal.create(user);
        String newAccessToken = jwtTokenProvider.generateAccessToken(principal);

        ResponseCookie accessCookie = ResponseCookie.from("accessToken", newAccessToken)
                .httpOnly(true)
                .secure(true)
                .path("/")
                .maxAge(Duration.ofMinutes(15))
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, accessCookie.toString());

        return newAccessToken;
    }

    public TokenResponse generateTokenResponse(User user) {
        User findUser = accountRepo.findByEmail(user.getEmail())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy user!"));

        UserPrincipal userPrincipal = new UserPrincipal(findUser);

        String accessToken = jwtTokenProvider.generateAccessToken(userPrincipal);
        String refreshToken = jwtTokenProvider.generateRefreshToken(userPrincipal);

        Profile profile = profileRepo.findById(user.getId())
                .orElseThrow(() -> new NoSuchElementException("Không tìm thấy profile!"));

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .user(TokenResponse.UserInfo.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .fullName(profile.getFullName())
                        .avatar(profile.getAvatarUrl())
                        .roleName(user.getRole().getRoleName())
                        .build())
                .build();
    }
}
