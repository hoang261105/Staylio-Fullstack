package com.example.staylio_backend.service;

import com.example.staylio_backend.dto.request.PasswordChangeRequest;
import com.example.staylio_backend.dto.request.ProfileRequest;
import com.example.staylio_backend.dto.response.ProfileResponseDTO;

import java.io.IOException;

public interface ProfileService {
    ProfileResponseDTO getUserProfileById(long id);

    ProfileResponseDTO updateInfo(Long id, ProfileRequest profileRequest) throws IOException;

    void changePassword(Long id, PasswordChangeRequest passwordChangeRequest);
}
