package com.example.staylio_backend.controller.auth;

import com.example.staylio_backend.config.security.principle.UserPrincipal;
import com.example.staylio_backend.dto.request.ProfileRequest;
import com.example.staylio_backend.dto.response.ApiResponse;
import com.example.staylio_backend.dto.response.ProfileResponseDTO;
import com.example.staylio_backend.service.ProfileService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin cá nhân")
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> getProfileMe(
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) {
        return ResponseEntity.ok(new ApiResponse<>(
            true,
            "Lấy thông tin cá nhân thành công!",
            profileService.getUserProfileById(userPrincipal.getId()),
            null,
            LocalDateTime.now()
        ));
    }

    @PatchMapping(value = "/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @Operation(summary = "Câp nhật thông tin",
            requestBody = @io.swagger.v3.oas.annotations.parameters.RequestBody(
                    content = @io.swagger.v3.oas.annotations.media.Content(
                            mediaType = MediaType.MULTIPART_FORM_DATA_VALUE,
                            schema = @io.swagger.v3.oas.annotations.media.Schema(implementation = ProfileRequest.class)
                    )
            ))
    public ResponseEntity<ApiResponse<ProfileResponseDTO>> updateProfile(
            @Valid @ModelAttribute ProfileRequest profileRequest,
            @AuthenticationPrincipal UserPrincipal userPrincipal
    ) throws IOException {
        return ResponseEntity.ok(new ApiResponse<>(
            true,
            "Cập nhật thông tin thành công",
            profileService.updateInfo(userPrincipal.getId(), profileRequest),
            null,
            LocalDateTime.now()
        ));
    }
}
