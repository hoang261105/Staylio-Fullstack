package com.example.staylio_backend.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class NewPasswordRequest {
    @NotBlank(message = "Mật khâu mới không được để trống!")
    @Size(min = 8, message = "Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa và số!")
    private String newPassword;

    @NotBlank(message = "Xác nhận mật khâu mới không được để trống!")
    @Size(min = 8, message = "Xác nhận mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa và số!")
    private String confirmNewPassword;
}