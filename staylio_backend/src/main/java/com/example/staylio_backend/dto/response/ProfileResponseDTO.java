package com.example.staylio_backend.dto.response;

import com.example.staylio_backend.model.enums.Gender;
import lombok.*;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProfileResponseDTO {
    private String fullName;
    private String email;
    private String phone;
    private String address;
    private LocalDate dateOfBirth;
    private String avatarUrl;
    private Gender gender;
}
