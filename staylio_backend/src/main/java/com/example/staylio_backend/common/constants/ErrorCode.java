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
    INVALID_LATITUDE("Vĩ độ không hợp lệ!"),
    INVALID_LONGITUDE("Kinh độ không hợp lệ!"),
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
    AI_QUOTA_EXCEEDED("Hết lượt dùng thử miễn phí"),
    INVALID_NUMBER_OF_GUESTS("Số lượng người không hợp lệ!"),
    CANNOT_REVIEW_BEFORE_CHECKOUT(
            "Bạn chỉ có thể đánh giá sau khi đã trả phòng!"
    ),
    TOXIC_COMMENT_DETECTED(
            "Đánh giá của bạn chứa ngôn từ không phù hợp với tiêu chuẩn cộng đồng!"
    ),
    INVALID_CHECK_IN_DATE(
            "Ngày nhận phòng không hợp lệ!"
    ),

    INVALID_CHECK_OUT_DATE(
            "Ngày trả phòng không hợp lệ!"
    ),

    CHECK_OUT_MUST_BE_AFTER_CHECK_IN(
            "Ngày trả phòng phải sau ngày nhận phòng!"
    ),

    INVALID_NUMBER_OF_ADULTS(
            "Số lượng người lớn không hợp lệ!"
    ),

    INVALID_NUMBER_OF_CHILDREN(
            "Số lượng trẻ em không hợp lệ!"
    ),

    EXCEED_MAX_ADULTS(
            "Số lượng người lớn vượt quá giới hạn của phòng!"
    ),

    EXCEED_MAX_CHILDREN(
            "Số lượng trẻ em vượt quá giới hạn của phòng!"
    ),

    EXCEED_ROOM_CAPACITY(
            "Tổng số khách vượt quá sức chứa của phòng!"
    ),

    ROOM_ALREADY_BOOKED(
            "Phòng đã được đặt trong khoảng thời gian này!"
    ),

    ROOM_NOT_AVAILABLE(
            "Phòng hiện không khả dụng để đặt!"
    ),

    INVALID_BOOKING_DATE(
            "Thông tin ngày đặt phòng không hợp lệ!"
    ),

    USER_VOUCHER_INVALID(
            "Voucher của người dùng không hợp lệ!"
    ),

    VOUCHER_NOT_ACTIVE(
            "Voucher hiện không hoạt động!"
    ),

    VOUCHER_NOT_APPROVED(
            "Voucher chưa được phê duyệt!"
    ),

    VOUCHER_NOT_STARTED(
            "Voucher chưa đến thời gian sử dụng!"
    ),

    VOUCHER_EXPIRED(
            "Voucher đã hết hạn!"
    ),

    VOUCHER_NOT_APPLICABLE_FOR_BRANCH(
            "Voucher không áp dụng cho chi nhánh này!"
    ),

    VOUCHER_NOT_APPLICABLE_FOR_ROOM(
            "Mã giảm giá không áp dụng cho phòng này!"
    ),

    MIN_ORDER_NOT_REACHED(
            "Đơn đặt phòng chưa đạt giá trị tối thiểu để áp dụng voucher!"
    ),
    
    WELCOME_VOUCHER_ONLY_FOR_FIRST_BOOKING(
            "Voucher này chỉ áp dụng cho lần đặt phòng đầu tiên!"
    ),

    VOUCHER_USAGE_LIMIT_EXCEEDED(
            "Voucher đã hết lượt sử dụng!"
    ),

    USER_VOUCHER_USAGE_LIMIT_EXCEEDED(
            "Bạn đã sử dụng hết số lần cho phép của voucher này!"
    ),
    BOOKING_CANNOT_BE_CANCELLED("Đơn đặt phòng không thể hủy!"),
    INVALID_PAYMENT_STATUS(
            "Trạng thái thanh toán không hợp lệ!"
    ),

    PAYMENT_ALREADY_PAID(
            "Giao dịch đã được thanh toán!"
    ),

    PAYMENT_ALREADY_CANCELLED(
            "Giao dịch đã bị hủy!"
    ),

    PAYMENT_ALREADY_REFUNDED(
            "Giao dịch đã được hoàn tiền!"
    ),

    CANNOT_UPDATE_PAID_PAYMENT_TO_PENDING(
            "Không thể chuyển giao dịch đã thanh toán về trạng thái chờ thanh toán!"
    ),

    CANNOT_CANCEL_PAID_PAYMENT(
            "Không thể hủy giao dịch đã thanh toán!"
    ),

    CANNOT_REFUND_UNPAID_PAYMENT(
            "Chỉ có thể hoàn tiền giao dịch đã thanh toán!"
    ),

    BOOKING_PAYMENT_STATUS_NOT_MATCH(
            "Trạng thái đặt phòng không phù hợp với trạng thái thanh toán!"
    ),

    BOOKING_ALREADY_CANCELLED(
            "Đơn đặt phòng đã bị hủy!"
    ),

    BOOKING_ALREADY_REFUNDED(
            "Đơn đặt phòng đã được hoàn tiền!"
    ),

    BOOKING_ALREADY_CHECKED_IN(
            "Khách đã nhận phòng, không thể cập nhật thanh toán!"
    ),

    BOOKING_ALREADY_CHECKED_OUT(
            "Khách đã trả phòng, không thể cập nhật thanh toán!"
    ),
    ZALOPAY_CREATE_ORDER_FAILED(
            "Không thể tạo giao dịch ZaloPay!"
    ),

    ZALOPAY_INVALID_CALLBACK_SIGNATURE(
            "Chữ ký callback ZaloPay không hợp lệ!"
    ),

    PAYPAL_CREATE_ORDER_FAILED(
            "Không thể tạo giao dịch PayPal!"
    ),

    PAYPAL_CAPTURE_FAILED(
            "Thực hiện capture thanh toán PayPal thất bại!"
    ),

    PAYPAL_GET_TOKEN_FAILED(
            "Không thể lấy access token từ PayPal!"
    ),

    PAYMENT_FAILED(
            "Thanh toán thất bại!"
    ),

    // 3xxx: Business Logic (Duplicates, DB logic)
    USER_EXISTED("Tên người dùng đã tồn tại"),
    EMAIL_EXISTED("Email đã được sử dụng"),
    USER_NOT_EXISTED("Người dùng không tồn tại"),
    PHONE_EXISTED("Số điện thoại đã tồn tại"),
    HOTEL_NAME_EXISTED("Tên thương hiệu đã tồn tại!"),
    MANAGER_EXISTED("Quản lí đã có thương hiệu khách sạn!"),
    HOTEL_HAS_ACTIVE_BOOKINGS("Không thể dừng hoạt động thương hiệu vì vẫn còn booking trong tương lai."),
    BRANCH_NAME_EXISTED("Tên chi nhánh đã tồn tại trong thương hiệu!"),
    ROOM_NAME_EXISTED("Tên phòng đã tồn tại!"),
    ROOM_NUMBER_EXISTED("Mã phòng đã tồn tại!"),
    UTILITY_TITLE_EXISTED("Tên tiện ích đã tồn tại!"),
    VOUCHER_CODE_EXISTED("Mã voucher đã tồn tại!"),
    ROOM_IMAGE_ALREADY_DELETED("Hình ảnh này đã được xóa rồi!"),
    CHAT_SESSION_CLOSED("Đoạn chat đã được đóng!"),
    BOOKING_ALREADY_REVIEWED(
            "Bạn đã đánh giá đơn đặt phòng này rồi!"
    ),

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
    REVIEW_NOT_FOUND("Không tìm thấy đánh giá!"),
    CHAT_SESSION_NOT_FOUND("Không tìm thấy đoạn chat!");

    private final String message;

    ErrorCode(String message) {
        this.message = message;
    }
}