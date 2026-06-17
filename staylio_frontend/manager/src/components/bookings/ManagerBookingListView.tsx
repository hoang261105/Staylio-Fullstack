import { Eye, Calendar, User, Hash, Building2, CreditCard, Wallet, Activity } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { BookingResponse } from "@common/interfaces/response/BookingResponse";
import dayjs from "dayjs";
import { bookingStatusColors, bookingStatusLabels, paymentStatusColors, paymentStatusLabels } from "@common/utils/booking.util";
import { paymentMethodLabels } from "@common/utils/booking.util";
import { Button } from "@common/components/ui/button";
import { BookingStatus } from "@common/enums/BookingStatus";

interface ManagerBookingListViewProps {
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

export default function ManagerBookingListView({
  bookings,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onUpdatePayment,
  onUpdateStatus,
}: ManagerBookingListViewProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-foreground font-semibold">
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
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                  Không tìm thấy đơn đặt phòng nào
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
                        <Hash className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{booking.bookingCode}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <User className="w-3.5 h-3.5" />
                          <span>{booking.customerName}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{booking.hotelBranchName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Phòng: <span className="font-semibold text-foreground">{booking.roomName}</span> - Số: <span className="font-semibold text-foreground">{booking.roomNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        <span>In: <span className="font-medium text-foreground">{dayjs(booking.checkInDate).format("DD/MM/YYYY")}</span></span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-rose-500" />
                        <span>Out: <span className="font-medium text-foreground">{dayjs(booking.checkOutDate).format("DD/MM/YYYY")}</span></span>
                      </div>
                      <div className="text-[10px] text-muted-foreground mt-0.5">
                        Tổng cộng: <span className="font-semibold">{booking.totalNights}</span> đêm
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="font-bold text-primary">
                        {booking.finalPrice.toLocaleString("vi-VN")} ₫
                      </div>
                      {booking.discountAmount > 0 && (
                        <div className="text-xs text-muted-foreground line-through">
                          {booking.originalPrice.toLocaleString("vi-VN")} ₫
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-[10px] font-medium text-muted-foreground uppercase">
                        <CreditCard className="w-3 h-3" />
                        <span>{paymentMethodLabels[booking.paymentMethod] || booking.paymentMethod}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${bookingStatusColors[booking.status] || "bg-muted text-foreground border-border"}`}>
                      {bookingStatusLabels[booking.status] || booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${paymentStatusColors[booking.paymentStatus] || "bg-muted text-foreground border-border"}`}>
                      {paymentStatusLabels[booking.paymentStatus] || booking.paymentStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {dayjs(booking.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {dayjs(booking.createdAt).format("HH:mm")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {
                        ![BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT].includes(booking.status as BookingStatus) && (
                          <Button
                            variant="ghost" size="icon"
                            onClick={() => onUpdatePayment(booking)}
                            title="Cập nhật thanh toán"
                            className="text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                          >
                            <Wallet className="w-4 h-4" />
                          </Button>
                        )
                      }

                      {![BookingStatus.CONFIRMED, BookingStatus.CANCELLED, BookingStatus.CHECKED_OUT].includes(booking.status as BookingStatus) && (
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => onUpdateStatus(booking)}
                          title="Cập nhật đặt phòng"
                          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        >
                          <Activity className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onView(booking)}
                        title="Xem chi tiết"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-4 bg-muted/50">
          <div>
            Hiển thị <span className="font-medium text-foreground">{bookings.length}</span> trên tổng số{" "}
            <span className="font-medium text-foreground">{totalElements}</span> đơn đặt phòng
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
