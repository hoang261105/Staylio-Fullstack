package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.RoleName;
import com.example.staylio_backend.model.enums.UserStatus;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class UserResponseDTO {
    private Long id;
    private String fullName;
    private String email;
    private String avatarUrl;
    private String phone;
    private LocalDate dateOfBirth;
    private RoleName roleName;
    private UserStatus status;
}
