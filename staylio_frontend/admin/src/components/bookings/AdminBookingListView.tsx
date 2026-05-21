import { Eye, Calendar, User, Hash, Building2, CreditCard, Wallet, Activity } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { BookingResponse } from "@common/interfaces/response/BookingResponse";
import dayjs from "dayjs";
import { bookingStatusColors, bookingStatusLabels, paymentStatusColors, paymentStatusLabels } from "@common/utils/booking.util";
import { paymentMethodLabels } from "@common/utils/booking.util";

interface AdminBookingListViewProps {
  bookings: BookingResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (booking: BookingResponse) => void;
  onUpdatePayment: (booking: BookingResponse) => void;
  onUpdateStatus: (booking: BookingResponse) => void;
}

export default function AdminBookingListView({
  bookings,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onUpdatePayment,
  onUpdateStatus,
}: AdminBookingListViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Mã đơn / Khách hàng</th>
              <th className="px-6 py-4">Chi nhánh / Phòng</th>
              <th className="px-6 py-4">Lịch trình</th>
              <th className="px-6 py-4">Thanh toán</th>
              <th className="px-6 py-4">Trạng thái đặt phòng</th>
              <th className="px-6 py-4">Trạng thái thanh toán</th>
              <th className="px-6 py-4">Ngày tạo</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy đơn đặt phòng nào
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{booking.bookingCode}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                          <User className="w-3.5 h-3.5" />
                          <span>{booking.customerName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{booking.hotelBranchName}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Phòng: <span className="font-semibold text-gray-700">{booking.roomName}</span> - Số: <span className="font-semibold text-gray-700">{booking.roomNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>In: <span className="font-medium text-gray-900">{dayjs(booking.checkInDate).format("DD/MM/YYYY")}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>Out: <span className="font-medium text-gray-900">{dayjs(booking.checkOutDate).format("DD/MM/YYYY")}</span></span>
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5">
                        Tổng cộng: <span className="font-semibold">{booking.totalNights}</span> đêm
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-bold text-[#0066FF]">
                        {booking.finalPrice.toLocaleString("vi-VN")} ₫
                      </div>
                      {booking.discountAmount > 0 && (
                        <div className="text-xs text-gray-500 line-through">
                          {booking.originalPrice.toLocaleString("vi-VN")} ₫
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 uppercase">
                        <CreditCard className="w-3 h-3" />
                        <span>{paymentMethodLabels[booking.paymentMethod] || booking.paymentMethod}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${bookingStatusColors[booking.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {bookingStatusLabels[booking.status] || booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${paymentStatusColors[booking.paymentStatus] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {paymentStatusLabels[booking.paymentStatus] || booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {dayjs(booking.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {dayjs(booking.createdAt).format("HH:mm")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* { <button
                        onClick={() => onUpdatePayment(booking)}
                        title="Cập nhật thanh toán"
                        className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-lg transition-colors border border-transparent hover:border-emerald-100"
                      >
                        <Wallet className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onUpdateStatus(booking)}
                        title="Cập nhật đặt phòng"
                        className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors border border-transparent hover:border-blue-100"
                      >
                        <Activity className="w-4 h-4" />
                      </button> } */}
                      <button
                        onClick={() => onView(booking)}
                        title="Xem chi tiết"
                        className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && bookings.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/50">
          <div>
            Hiển thị <span className="font-medium text-gray-900">{bookings.length}</span> trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span> đơn đặt phòng
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
