/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotificationResponse } from "../interfaces/response/NotificationResponse";
import { getReviewById } from "../services/review.service";

export const navigateByNotification = (
  notification: NotificationResponse,
  navigate: (path: string, options?: any) => void
) => {
  if (!notification.referenceId) return;

  const role = localStorage.getItem("roleName")?.replace("ROLE_", "");
  const type = notification.type;

  if (type.startsWith("BOOKING_")) {
    if (role === "CUSTOMER") navigate("/booking-history", { state: { bookingId: notification.referenceId } });
    if (role === "MANAGER" || role === "ADMIN") navigate("/bookings", { state: { bookingId: notification.referenceId } });
  } else if (type.startsWith("REVIEW_")) {
    if (role === "MANAGER" || role === "ADMIN") navigate("/reviews", { state: { reviewId: notification.referenceId } });
    if (role === "CUSTOMER") {
      getReviewById(notification.referenceId).then(res => {
        const review = res.data;
        if (review) {
          navigate(`/hotel/${review.hotelId}/branch/${review.hotelBranchId}/room/${review.roomId}/reviews`);
        }
      }).catch(err => {
        console.error("Lỗi khi lấy thông tin đánh giá:", err);
      });
    }
  } else if (type.startsWith("VOUCHER_")) {
    if (role === "MANAGER" || role === "ADMIN") navigate("/vouchers", { state: { voucherId: notification.referenceId } });
  } else if (type.startsWith("ROOM_IMAGE_")) {
    if (role === "MANAGER" || role === "ADMIN") navigate("/room-images", { state: { imageId: notification.referenceId } });
  } else if (type.startsWith("HOTEL_BRANCH_") || type.startsWith("HOTEL_BRAND_")) {
    if (role === "ADMIN") navigate("/hotel-branches", { state: { branchId: notification.referenceId } });
    if (role === "MANAGER") navigate("/branches", { state: { branchId: notification.referenceId } });
  } else if (type === "CHAT_MESSAGE_CREATED") {
    if (role === "MANAGER") navigate("/branches", { state: { chatSessionId: notification.referenceId } });
  }
};
