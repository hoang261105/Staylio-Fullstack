package com.example.staylio_backend.service.impl;

import com.example.staylio_backend.dto.request.ProfileRequest;
import com.example.staylio_backend.dto.response.ProfileResponseDTO;
import com.example.staylio_backend.exception.AppException;
import com.example.staylio_backend.model.entity.Profile;
import com.example.staylio_backend.model.entity.User;
import com.example.staylio_backend.model.enums.ErrorCode;
import com.example.staylio_backend.repository.AccountRepo;
import com.example.staylio_backend.repository.ProfileRepo;
import com.example.staylio_backend.service.CloudinaryService;
import com.example.staylio_backend.service.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.NoSuchElementException;

@Service
@RequiredArgsConstructor
public class ProfileServiceImpl implements ProfileService {
    private final ProfileRepo profileRepo;
    private final AccountRepo accountRepo;
    private final CloudinaryService cloudinaryService;

    @Override
    public ProfileResponseDTO getUserProfileById(long id) {
        Profile profile = profileRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Profile with id " + id + " does not exist"));
        return convertToDTO(profile);
    }

    @Override
    public ProfileResponseDTO updateInfo(Long id, ProfileRequest profileRequest) throws IOException {
        Profile profile = profileRepo.findById(id).orElseThrow(() -> new NoSuchElementException("Profile with id " + id + " does not exist"));

        User user = accountRepo.findById(id).orElseThrow(() -> new NoSuchElementException("User with id " + id + " does not exist"));

        boolean isExistPhone = profileRepo.existsByPhoneAndIdNot(profile.getPhone(), user.getId());

        if (isExistPhone) {
            throw new AppException(ErrorCode.PHONE_EXISTED, "phone");
        }

        boolean isExistEmail = accountRepo.existsByEmailAndIdNot(profileRequest.getEmail(), user.getId());

        if (isExistEmail) {
            throw new AppException(ErrorCode.EMAIL_EXISTED, "email");
        }

        String avatarUrl = cloudinaryService.uploadFile(profileRequest.getImage());

        profile.setFullName(profileRequest.getFullName());
        profile.setPhone(profileRequest.getPhone());
        profile.setAddress(profileRequest.getAddress());
        profile.setGender(profileRequest.getGender());
        profile.setAvatarUrl(avatarUrl);
        profile.setDateOfBirth(profileRequest.getDateOfBirth());
        user.setEmail(profileRequest.getEmail());

        Profile updatedProfile = profileRepo.save(profile);
        accountRepo.save(user);
        return convertToDTO(updatedProfile);
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
