import { BookingStatus } from "../enums/BookingStatus";
import { PaymentStatus } from "../enums/PaymentStatus";
import { PaymentMethod } from "../enums/PaymentMethod";

export const bookingStatusColors: Record<BookingStatus, string> = {
  [BookingStatus.PENDING_PAYMENT]: "bg-amber-50 text-amber-700 border-amber-200",
  [BookingStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [BookingStatus.CONFIRMED]: "bg-blue-50 text-blue-700 border-blue-200",
  [BookingStatus.CHECKED_IN]: "bg-indigo-50 text-indigo-700 border-indigo-200",
  [BookingStatus.CHECKED_OUT]: "bg-gray-50 text-gray-700 border-gray-200",
  [BookingStatus.CANCELLED]: "bg-rose-50 text-rose-700 border-rose-200",
  [BookingStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

export const bookingStatusLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING_PAYMENT]: "Chờ thanh toán",
  [BookingStatus.PAID]: "Đã thanh toán",
  [BookingStatus.CONFIRMED]: "Đã xác nhận",
  [BookingStatus.CHECKED_IN]: "Đã nhận phòng",
  [BookingStatus.CHECKED_OUT]: "Đã trả phòng",
  [BookingStatus.CANCELLED]: "Đã hủy",
  [BookingStatus.REFUNDED]: "Đã hoàn tiền",
};

export const paymentStatusColors: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
  [PaymentStatus.PAID]: "bg-emerald-50 text-emerald-700 border-emerald-200",
  [PaymentStatus.FAILED]: "bg-rose-50 text-rose-700 border-rose-200",
  [PaymentStatus.CANCELLED]: "bg-gray-50 text-gray-700 border-gray-200",
  [PaymentStatus.REFUNDED]: "bg-purple-50 text-purple-700 border-purple-200",
};

export const paymentStatusLabels: Record<PaymentStatus, string> = {
  [PaymentStatus.PENDING]: "Chờ thanh toán",
  [PaymentStatus.PAID]: "Đã thanh toán",
  [PaymentStatus.FAILED]: "Thất bại",
  [PaymentStatus.CANCELLED]: "Đã hủy",
  [PaymentStatus.REFUNDED]: "Đã hoàn tiền",
};

export const paymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.VNPAY]: "VNPay",
  [PaymentMethod.MOMO]: "MoMo",
  [PaymentMethod.ZALOPAY]: "ZaloPay",
  [PaymentMethod.CASH]: "Tiền mặt",
  [PaymentMethod.BANK_TRANSFER]: "Chuyển khoản",
  [PaymentMethod.PAYPAL]: "PayPal",
};
