package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.Gender;
import com.example.staylio_backend.common.utils.CustomDateDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class ProfileRequest {
    @NotBlank(message = "Full name cannot be blank")
    private String fullName;

    @NotBlank(message = "Email cannot be blank")
    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Invalid email format!")
    private String email;

    @NotBlank(message = "Phone cannot be blank")
    @Pattern(
            regexp = "^(0|84)([35789])([0-9]{8})$",
            message = "Invalid phone!"
    )
    private String phone;

    private String address;

    @NotNull(message = "Please enter your birthday.")
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Past(message = "Birthday must be a past date")
    private LocalDate dateOfBirth;

    @NotNull(message = "Please select an image")
    @Schema(description = "Avatar image file", type = "string", format = "binary")
    private MultipartFile image;
    private Gender gender;
}
