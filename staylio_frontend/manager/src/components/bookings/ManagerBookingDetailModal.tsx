import { useState } from "react";
import { X, User, Phone, Mail, Calendar, Building, CreditCard, Tag, FileText, Info, Hash, Building2, BedDouble, Sparkles } from "lucide-react";
import { useBookingById, useUpdateStatusBookingMutation } from "@common/hooks/useBookings";
import { BookingStatus } from "@common/enums/BookingStatus";
import { InputField } from "@common/components/InputField";

interface ManagerBookingDetailModalProps {
  bookingId: number;
  onClose: () => void;
}

import {
  bookingStatusColors,
  bookingStatusLabels,
  paymentStatusColors,
  paymentStatusLabels,
  paymentMethodLabels,
} from "@common/utils/booking.util";
import { formatDateTime, formatDate } from "@common/utils/date.util";

export default function ManagerBookingDetailModal({ bookingId, onClose }: ManagerBookingDetailModalProps) {
  const { data: booking, isLoading, isError } = useBookingById(bookingId);
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateStatusBookingMutation(bookingId);

  const [confirmAction, setConfirmAction] = useState<{ status: BookingStatus; title: string; isCancel?: boolean } | null>(null);
  const [cancellationReason, setCancellationReason] = useState("");
  const [cancelError, setCancelError] = useState("");

  const handleOpenConfirm = (status: BookingStatus, title: string, isCancel: boolean = false) => {
    setConfirmAction({ status, title, isCancel });
    setCancellationReason("");
    setCancelError("");
  };

  const handleUpdateStatus = () => {
    if (!confirmAction) return;

    if (confirmAction.isCancel) {
      if (!cancellationReason.trim()) {
        setCancelError("Vui lòng nhập lý do hủy");
        return;
      }
    }

    updateStatus({
      status: confirmAction.status,
      cancellationReason: confirmAction.isCancel ? cancellationReason : undefined
    }, {
      onSuccess: () => {
        setConfirmAction(null);
        setCancellationReason("");
        setCancelError("");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0066FF]/10 text-[#0066FF] rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chi tiết đơn đặt phòng</h2>
              {!isLoading && booking && (
                <p className="text-sm text-gray-500 font-medium">Mã đơn: {booking.bookingCode}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium text-sm">Đang tải thông tin...</p>
            </div>
          ) : isError || !booking ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
              <Info className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-medium">Không thể tải thông tin đặt phòng.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <User className="w-4 h-4 text-gray-500" />
                    Thông tin Khách hàng
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Họ và tên:</span>
                      <span className="font-medium text-gray-900">{booking.customerName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Số điện thoại:</span>
                      <span className="font-medium text-gray-900">{booking.customerPhone || "---"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500 flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email:</span>
                      <span className="font-medium text-gray-900 truncate max-w-50" title={booking.customerEmail}>{booking.customerEmail || "---"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Người lớn / Trẻ em:</span>
                      <span className="font-medium text-gray-900">{booking.adults} NL / {booking.children} TE</span>
                    </div>
                    {booking.note && (
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <span className="text-gray-500 block mb-1">Ghi chú của khách:</span>
                        <p className="text-gray-700 italic bg-gray-50 p-2 rounded-lg text-xs">{booking.note}</p>
                      </div>
                    )}
                    {booking.preferences && (
                      <div className="pt-2 border-t border-gray-100 mt-2">
                        <span className="text-gray-500 flex items-center gap-1.5 mb-2 font-medium">
                          <Sparkles className="w-4 h-4 text-amber-500" />
                          Yêu cầu cá nhân hóa (Checklist)
                        </span>
                        <div className="bg-amber-50 rounded-lg p-3 space-y-2 border border-amber-100/50">
                          {(() => {
                            try {
                              const prefs = JSON.parse(booking.preferences);
                              return (
                                <ul className="space-y-2">
                                  {prefs.scent && (
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                      <input type="checkbox" className="w-4 h-4 rounded text-amber-500 border-gray-300 focus:ring-amber-500" />
                                      <span><strong>Mùi hương:</strong> {prefs.scent}</span>
                                    </li>
                                  )}
                                  {prefs.pillow && (
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                      <input type="checkbox" className="w-4 h-4 rounded text-amber-500 border-gray-300 focus:ring-amber-500" />
                                      <span><strong>Gối ngủ:</strong> {prefs.pillow}</span>
                                    </li>
                                  )}
                                  {prefs.setup && (
                                    <li className="flex items-center gap-2 text-sm text-gray-700">
                                      <input type="checkbox" className="w-4 h-4 rounded text-amber-500 border-gray-300 focus:ring-amber-500" />
                                      <span><strong>Set-up đặc biệt:</strong> {prefs.setup}</span>
                                    </li>
                                  )}
                                </ul>
                              );
                            } catch (e: any) {
                              return <p className="text-xs text-gray-500">Lỗi định dạng cấu hình: {booking.preferences}</p>;
                            }
                          })()}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <Building className="w-4 h-4 text-gray-500" />
                    Thông tin Khách sạn & Phòng
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <div className="flex items-start gap-4 mb-4">
                      {booking.roomImage ? (
                        <img src={booking.roomImage} alt={booking.roomName} className="w-20 h-20 object-cover rounded-lg border border-gray-100" />
                      ) : (
                        <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <BedDouble className="w-8 h-8" />
                        </div>
                      )}
                      <div className="flex-1 space-y-1.5">
                        <div className="font-semibold text-gray-900 text-base">{booking.roomName}</div>
                        <div className="text-gray-600 flex items-center gap-1.5">
                          <Hash className="w-3.5 h-3.5" /> Số phòng: <span className="font-medium">{booking.roomNumber}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <span className="text-gray-500">Khách sạn:</span>
                      <span className="font-medium text-gray-900">{booking.hotelName}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Chi nhánh:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1"><Building2 className="w-3.5 h-3.5 text-gray-400" /> {booking.hotelBranchName}</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Lịch trình & Trạng thái
                  </div>
                  <div className="p-4 space-y-4 text-sm">
                    <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-500 uppercase font-medium">Check-In</div>
                        <div className="font-bold text-emerald-600 text-base">{formatDate(booking.checkInDate)}</div>
                        <div className="text-xs text-gray-400">14:00</div>
                      </div>
                      <div className="flex-1 flex items-center justify-center px-4">
                        <div className="w-full h-px bg-gray-300 relative">
                          <span className="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 bg-white px-2 text-xs font-semibold text-gray-500 border border-gray-200 rounded-full">
                            {booking.totalNights} đêm
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1 text-center">
                        <div className="text-xs text-gray-500 uppercase font-medium">Check-Out</div>
                        <div className="font-bold text-rose-600 text-base">{formatDate(booking.checkOutDate)}</div>
                        <div className="text-xs text-gray-400">12:00</div>
                      </div>
                    </div>

                    <div className="space-y-3 pt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Trạng thái đặt phòng:</span>
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${bookingStatusColors[booking.status]}`}>
                          {bookingStatusLabels[booking.status] || booking.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Ngày tạo:</span>
                        <span className="font-medium text-gray-900">{formatDateTime(booking.createdAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Ngày xác nhận:</span>
                        <span className="font-medium text-gray-900">{formatDateTime(booking.confirmedAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Ngày Check-in thực tế:</span>
                        <span className="font-medium text-gray-900">{formatDateTime(booking.checkedInAt)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Ngày Check-out thực tế:</span>
                        <span className="font-medium text-gray-900">{formatDateTime(booking.checkedOutAt)}</span>
                      </div>
                      {booking.cancelledAt && (
                        <div className="flex items-center justify-between text-rose-600">
                          <span className="font-medium">Ngày hủy:</span>
                          <span className="font-medium">{formatDateTime(booking.cancelledAt)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2 text-sm">
                    <CreditCard className="w-4 h-4 text-gray-500" />
                    Thanh toán & Hóa đơn
                  </div>
                  <div className="p-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Trạng thái:</span>
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${paymentStatusColors[booking.paymentStatus]}`}>
                        {paymentStatusLabels[booking.paymentStatus] || booking.paymentStatus}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Phương thức:</span>
                      <span className="font-medium text-gray-900 flex items-center gap-1.5 bg-gray-100 px-2.5 py-1 rounded-md text-xs border border-gray-200">
                        {paymentMethodLabels[booking.paymentMethod] || booking.paymentMethod}
                      </span>
                    </div>
                    {booking.transactionId && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Mã giao dịch:</span>
                        <span className="font-medium text-gray-900 font-mono text-xs">{booking.transactionId}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Thời gian TT:</span>
                      <span className="font-medium text-gray-900">{formatDateTime(booking.paidAt)}</span>
                    </div>

                    <div className="pt-3 border-t border-gray-100 space-y-2 mt-3">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-500">Tiền phòng ({booking.totalNights} đêm):</span>
                        <span className="font-medium text-gray-900">{booking.originalPrice.toLocaleString("vi-VN")} ₫</span>
                      </div>

                      {booking.discountAmount > 0 && (
                        <div className="flex items-center justify-between text-emerald-600">
                          <span className="flex items-center gap-1.5">
                            <Tag className="w-3.5 h-3.5" />
                            Giảm giá {booking.voucherCode ? `(${booking.voucherCode})` : ""}
                          </span>
                          <span className="font-medium">-{booking.discountAmount.toLocaleString("vi-VN")} ₫</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
                        <span className="font-bold text-gray-900">Tổng thu:</span>
                        <span className="font-bold text-xl text-[#0066FF]">{booking.finalPrice.toLocaleString("vi-VN")} ₫</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {booking && (booking.status === BookingStatus.PENDING_PAYMENT || booking.status === BookingStatus.PAID || booking.status === BookingStatus.CONFIRMED) && (
              <button
                onClick={() => handleOpenConfirm(BookingStatus.CANCELLED, "Hủy booking", true)}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-rose-600 bg-white border border-rose-200 rounded-xl hover:bg-rose-50 transition-colors disabled:opacity-50"
              >
                Hủy booking
              </button>
            )}

            {booking?.status === BookingStatus.PAID && (
              <button
                onClick={() => handleOpenConfirm(BookingStatus.CONFIRMED, "Xác nhận booking")}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0066FF] rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
              >
                Xác nhận booking
              </button>
            )}

            {booking?.status === BookingStatus.CONFIRMED && (
              <button
                onClick={() => handleOpenConfirm(BookingStatus.CHECKED_IN, "Check-in")}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 transition-colors disabled:opacity-50"
              >
                Check-in
              </button>
            )}

            {booking?.status === BookingStatus.CHECKED_IN && (
              <button
                onClick={() => handleOpenConfirm(BookingStatus.CHECKED_OUT, "Check-out")}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-amber-500 rounded-xl hover:bg-amber-600 transition-colors disabled:opacity-50"
              >
                Check-out
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>

      {confirmAction && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">{confirmAction.title}</h3>
            <p className="text-sm text-gray-600 mb-4">
              Bạn có chắc chắn muốn {confirmAction.title.toLowerCase()} này không?
            </p>
            {confirmAction.isCancel && (
              <InputField
                label="Lý do hủy"
                placeholder="Nhập lý do hủy booking..."
                value={cancellationReason}
                onChange={(e) => {
                  setCancellationReason(e.target.value);
                  if (e.target.value.trim()) setCancelError("");
                }}
                error={cancelError}
                required
              />
            )}
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmAction(null)}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                Hủy bỏ
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="px-4 py-2 text-sm font-medium text-white bg-[#0066FF] rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isUpdating && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
