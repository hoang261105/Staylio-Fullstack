import dayjs from "dayjs";
import { BookingStatus } from "../../../../common/enums/BookingStatus";
import {
  bookingStatusColors,
  bookingStatusLabels,
} from "../../../../common/utils/booking.util";
import { Building2, Calendar, Hash, MapPin, Users } from "lucide-react";
import type { BookingHistoryResponse } from "../../../../common/interfaces/response/BookingHistoryResponse";

interface BookingHistoryListViewProps {
  bookings: BookingHistoryResponse[];
  isLoading: boolean;
  onCancel: (bookingId: number) => void;
}

export default function BookingHistoryListView({
  bookings,
  isLoading,
  onCancel,
}: BookingHistoryListViewProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 flex gap-6"
          >
            <div className="w-32 h-32 bg-gray-200 rounded-xl shrink-0"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          Không tìm thấy đơn đặt phòng
        </h3>
        <p className="text-gray-500">
          Chưa có lịch sử đặt phòng nào phù hợp với tìm kiếm của bạn.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => {
        const statusKey = booking.status as keyof typeof bookingStatusLabels;
        const statusLabel = bookingStatusLabels[statusKey] || booking.status;
        const statusColorClass =
          bookingStatusColors[statusKey] ||
          "bg-gray-50 text-gray-700 border-gray-200";

        return (
          <div
            key={booking.bookingId}
            className="bg-white p-4 md:p-6 rounded-2xl border border-gray-100 hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
          >
            <div className="w-full md:w-40 h-48 md:h-32 shrink-0">
              <img
                src={booking.imageUrl || "/placeholder-room.jpg"}
                alt={booking.roomName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColorClass}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-xs text-gray-500 flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-full border border-gray-100">
                      <Hash className="w-3 h-3" />
                      {booking.bookingCode}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Đặt lúc:{" "}
                    {dayjs(booking.createdAt).format("HH:mm - DD/MM/YYYY")}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {booking.roomName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-gray-400" />
                    <span>{booking.hotelName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l pl-4 border-gray-200">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span>{booking.hotelBranchName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-gray-50 rounded-xl mb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">
                      Nhận phòng
                    </div>
                    <div className="font-semibold text-gray-900">
                      {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">
                      Trả phòng
                    </div>
                    <div className="font-semibold text-gray-900">
                      {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">
                      Khách
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-gray-900">
                      <Users className="w-3.5 h-3.5" />
                      {booking.adults} NL, {booking.children} TE
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-gray-500 mb-0.5">
                      Tổng tiền
                    </div>
                    <div className="font-bold text-[#0066FF]">
                      {booking.finalPrice.toLocaleString("vi-VN")} ₫
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {booking.status === BookingStatus.PENDING_PAYMENT && (
                  <>
                    {booking.paymentUrl && (
                      <button
                        onClick={() => window.location.href = booking.paymentUrl!}
                        className="px-4 py-2 text-sm font-medium text-white bg-[#0066FF] hover:bg-blue-700 rounded-lg transition-colors shadow-sm"
                      >
                        Thanh toán ngay
                      </button>
                    )}
                    <button
                      onClick={() => onCancel(booking.bookingId)}
                      className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100"
                    >
                      Hủy đơn
                    </button>

                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
