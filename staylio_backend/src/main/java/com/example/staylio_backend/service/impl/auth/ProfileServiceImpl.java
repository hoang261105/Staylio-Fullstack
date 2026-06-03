package com.example.staylio_backend.service.impl.auth;

import com.example.staylio_backend.dto.request.PasswordChangeRequest;
import com.example.staylio_backend.dto.request.ProfileRequest;
import com.example.staylio_backend.dto.response.ProfileResponseDTO;
import com.example.staylio_backend.common.exception.AppException;
import com.example.staylio_backend.common.exception.BadRequestException;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.common.constants.ErrorCode;
import com.example.staylio_backend.repository.AccountRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.CloudinaryService;
import com.example.staylio_backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepo profileRepo;
    private final AccountRepo accountRepo;
    private final CloudinaryService cloudinaryService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public ProfileResponseDTO getUserProfileById(long id) {
        Profile profile = profileRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Profile with id " + id + " does not exist"));
        return convertToDTO(profile);
    }

    @Override
    public ProfileResponseDTO updateInfo(Long id, ProfileRequest profileRequest) {
        Profile profile = profileRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Profile with id " + id + " does not exist"));

        User user = accountRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with id " + id + " does not exist"));

        boolean isExistPhone = profileRepo.existsByPhoneAndIdNot(profileRequest.getPhone(), user.getId());

        if (isExistPhone) {
            throw new AppException(ErrorCode.PHONE_EXISTED, "phone");
        }

        boolean isExistEmail = accountRepo.existsByEmailAndIdNot(profileRequest.getEmail(), user.getId());

        if (isExistEmail) {
            throw new AppException(ErrorCode.EMAIL_EXISTED, "email");
        }

        profile.setFullName(profileRequest.getFullName());
        profile.setPhone(profileRequest.getPhone());
        profile.setAddress(profileRequest.getAddress());
        profile.setGender(profileRequest.getGender());
        profile.setDateOfBirth(profileRequest.getDateOfBirth());
        profile.setAvatarUrl(profileRequest.getAvatarUrl());
        user.setEmail(profileRequest.getEmail());

        Profile updatedProfile = profileRepo.save(profile);
        accountRepo.save(user);
        return convertToDTO(updatedProfile);
    }

    @Override
    public void changePassword(Long id, PasswordChangeRequest passwordChangeRequest) {
        User user = accountRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with id " + id + " does not exist"));

        if (!passwordEncoder.matches(passwordChangeRequest.getOldPassword(), user.getPasswordHash())){
            throw new BadRequestException("Mật khẩu cũ không chính xác!");
        }

        if(!passwordChangeRequest.getNewPassword().equals(passwordChangeRequest.getConfirmNewPassword())){
            throw new AppException(ErrorCode.PASSWORD_NOT_MATCH);
        }

        if (passwordEncoder.matches(passwordChangeRequest.getNewPassword(), user.getPasswordHash())){
            throw new BadRequestException("Mật khẩu mới không được giống mật khẩu cũ!");
        }

        user.setPasswordHash(passwordEncoder.encode(passwordChangeRequest.getNewPassword()));
        user.setIsFirstLogin(false);
        accountRepo.save(user);
    }

    public ProfileResponseDTO convertToDTO(Profile profile) {
        User user = accountRepo.findById(profile.getId()).orElseThrow(() -> new NoSuchElementException("Account with id " + profile.getId() + " does not exist"));

        return ProfileResponseDTO.builder()
                .fullName(profile.getFullName())
                .email(user.getEmail())
                .address(profile.getAddress())
                .avatarUrl(profile.getAvatarUrl())
                .dateOfBirth(profile.getDateOfBirth())
                .gender(profile.getGender())
                .phone(profile.getPhone())
                .build();
    }
}
