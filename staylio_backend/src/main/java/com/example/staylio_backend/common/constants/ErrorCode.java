package com.example.staylio_backend.common.constants;

import lombok.Getter;

@Getter
public enum ErrorCode {
    // 9xxx: System
    UNCATEGORIZED_EXCEPTION("Lỗi hệ thống chưa được phân loại"),

    // 1xxx: Auth
    UNAUTHENTICATED("Cần xác thực để truy cập tài nguyên này"),
    UNAUTHORIZED("Bạn không có quyền truy cập tài nguyên này"),
    INVALID_TOKEN("Token không hợp lệ"),
    TOKEN_ALREADY_USED("Token đã được sử dụng!"),
    TOKEN_EXPIRED("Token đã hết hạn!"),
    CANNOT_SEND_EMAIL("Không thể gửi email!"),
    CANNOT_LOCK_SELF("Không được khóa tài khoản chính mình!"),
    CANNOT_LOCK_ADMIN("Không thể khóa tài khoản admin!"),
    ACCOUNT_LOCKED("Tài khoản đã bị khóa!"),
    IS_NOT_MANAGER("Vui lòng chọn 1 tài khoản manager!"),

    // 2xxx: Validation (Regex, NotBlank, etc.)
    INVALID_KEY("Khóa thông báo không hợp lệ"),
    INVALID_PASSWORD_OR_EMAIL("Email hoặc mật khẩu không chính xác"),

    // 3xxx: Business Logic (Duplicates, DB logic)
    USER_EXISTED("Tên người dùng đã tồn tại"),
    EMAIL_EXISTED("Email đã được sử dụng"),
    USER_NOT_EXISTED("Người dùng không tồn tại"),
    PHONE_EXISTED("Số điện thoại đã tồn tại"),
    HOTEL_NAME_EXISTED("Tên thương hiệu đã tồn tại!"),
    MANAGER_EXISTED("Quản lí đã có thương hiệu khách sạn!"),

    // 4xxx: Resources
    DATA_NOT_FOUND("Không tìm thấy dữ liệu yêu cầu"),
    EMAIL_NOT_FOUND("Không tìm thấy email"),
    USER_NOT_FOUND("Không tìm thấy người dùng");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}