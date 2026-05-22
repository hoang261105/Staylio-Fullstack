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
    ACCOUNT_LOCKED("Tài khoản đã bị khóa. Vui lòng liên hệ thêm để được hỗ trợ!"),
    IS_NOT_MANAGER("Vui lòng chọn 1 tài khoản manager!"),
    BOOKING_NOT_PAID("Đơn đặt phòng chủa thanh toán!"),
    INVALID_BOOKING_STATUS("Trạng thái đơn đặt phòng không hợp lệ!"),

    // 2xxx: Validation (Regex, NotBlank, etc.)
    INVALID_KEY("Khóa thông báo không hợp lệ"),
    INVALID_PASSWORD_OR_EMAIL("Email hoặc mật khẩu không chính xác"),
    ILLEGAL_STATUS_TRANSITION("Dữ liệu đã được phê duyệt và không thể thay đổi hoặc xóa."),
    CANNOT_MODIFY_TERMINAL_STATE("Không thể chỉnh sửa trạng thái cuối!"),
    PASSWORD_NOT_MATCH("Mật khẩu không khớp!"),
    CANNOT_DELETE_BRANCH("Không thể xóa chi nhánh đã duyệt!"),
    CANNOT_CREATE_BRAND_HOTEL("Không thể tạo chi nhánh do thương hiệu chưa được duyệt!"),
    CANNOT_CREATE_ROOM("Không thể tạo phòng do chi nhánh chưa được duyệt!"),
    INVALID_VOUCHER_DATE("Ngày hết hạn phải sau ngày hiện tại!"),
    INVALID_DISCOUNT_VALUE("Phần trăm giảm giá phải nhỏ hơn 100%!"),
    INVALID_IMAGE_STATUS("Trạng thái không hợp lệ!"),
    REJECTION_REASON_REQUIRED("Vui lòng nhập lý do từ chối!"),
    CANCELLATION_REASON_REQUIRED("Vui lòng nhập lí do hủy!"),

    // 3xxx: Business Logic (Duplicates, DB logic)
    USER_EXISTED("Tên người dùng đã tồn tại"),
    EMAIL_EXISTED("Email đã được sử dụng"),
    USER_NOT_EXISTED("Người dùng không tồn tại"),
    PHONE_EXISTED("Số điện thoại đã tồn tại"),
    HOTEL_NAME_EXISTED("Tên thương hiệu đã tồn tại!"),
    MANAGER_EXISTED("Quản lí đã có thương hiệu khách sạn!"),
    BRANCH_NAME_EXISTED("Tên chi nhánh đã tồn tại trong thương hiệu!"),
    ROOM_NAME_EXISTED("Tên phòng đã tồn tại!"),
    ROOM_NUMBER_EXISTED("Mã phòng đã tồn tại!"),
    UTILITY_TITLE_EXISTED("Tên tiện ích đã tồn tại!"),
    VOUCHER_CODE_EXISTED("Mã voucher đã tồn tại!"),
    ROOM_IMAGE_ALREADY_DELETED("Hình ảnh này đã được xóa rồi!"),

    // 4xxx: Resources
    DATA_NOT_FOUND("Không tìm thấy dữ liệu yêu cầu"),
    EMAIL_NOT_FOUND("Không tìm thấy email"),
    USER_NOT_FOUND("Không tìm thấy người dùng"),
    HOTEL_BRAND_NOT_FOUND("Không tìm thấy thương hiệu khách sạn!"),
    PROVINCE_NOT_FOUND("Không tìm thấy tỉnh thành!"),
    WARD_NOT_FOUND("Không tìm thấy xã/phường!"),
    HOTEL_BRANCH_NOT_FOUND("Không tìm thấy chi nhánh!"),
    ROOM_NOT_FOUND("Không tìm thấy phòng!"),
    UTILITY_NOT_FOUND("Không tìm thấy tiện ích!"),
    ROOM_IMAGE_NOT_FOUND("Không tìm thấy hình ảnh phòng!"),
    VOUCHER_NOT_FOUND("Không tìm thấy voucher!"),
    USER_VOUCHER_NOT_FOUND("Không tìm thấy voucher của người dùng!"),
    BOOKING_NOT_FOUND("Không tìm thấy đơn đặt phòng!"),
    PAYMENT_NOT_FOUND("Không tìm thấy phương thức thanh toán!"),
    REVIEW_NOT_FOUND("Không tìm thấy đánh giá!");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}