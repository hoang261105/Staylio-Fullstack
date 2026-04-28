package com.example.staylio_backend.dto.request;

import com.example.staylio_backend.model.enums.Gender;
import com.example.staylio_backend.utils.CustomDateDeserializer;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserRegisterRequest {

    @NotBlank(message = "Username không được để trống!")
    @Size(min = 6, max = 50, message = "Username phải từ 6 đến 50 ký tự!")
    private String userName;

    @NotBlank(message = "Full name không được để trống!")
    private String fullName;

    @NotNull(message = "Vui lòng chọn giới tính.")
    private Gender gender;

    @NotNull(message = "Vui lòng nhập ngày sinh!")
    @JsonDeserialize(using = CustomDateDeserializer.class)
    @Past(message = "Ngày sinh phải nhỏ hơn ngày hiện tại")
    private LocalDate dateOfBirth;

    @NotBlank(message = "Email không được để trống!")
    @Email(regexp = "^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$", message = "Email không đúng định dạng!")
    private String email;

    @NotBlank(message = "Mật khẩu không được để trống!")
    @Size(min = 8, message = "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa và số!")
    private String password;
}