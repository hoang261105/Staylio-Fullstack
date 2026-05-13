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
    @NotBlank(message = "Họ tên không được để trống!")
    private String fullName;

    @NotBlank(message = "Email không được để trống!")
    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email không đúng định dạng!!")
    private String email;

    @NotBlank(message = "So điện thoại không được để trống!")
    @Pattern(
            regexp = "^(0|84)([35789])([0-9]{8})$",
            message = "Số điện thoại không hợp lệ!"
    )
    private String phone;

    private String address;

    @NotNull(message = "Vui lòng nhập ngày sinh.")
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Past(message = "Ngày sinh phải nhỏ hơn ngày hiện tại!")
    private LocalDate dateOfBirth;

    private String avatarUrl;
    private Gender gender;
}
