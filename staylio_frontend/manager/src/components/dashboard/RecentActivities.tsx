import { useBookings } from "@common/hooks/useBookings";
import { formatCurrency } from "@common/utils/currency.util";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import { Loader2, Activity } from "lucide-react";
import { BookingStatus } from "@common/enums/BookingStatus";

const getBookingStatusConfig = (status: BookingStatus) => {
  switch (status) {
    case BookingStatus.CONFIRMED: return { label: "Đã xác nhận", color: "text-green-600 bg-green-50" };
    case BookingStatus.PENDING_PAYMENT: return { label: "Chờ thanh toán", color: "text-yellow-600 bg-yellow-50" };
    case BookingStatus.PAID: return { label: "Đã thanh toán", color: "text-blue-600 bg-blue-50" };
    case BookingStatus.CHECKED_IN: return { label: "Đã Check-in", color: "text-purple-600 bg-purple-50" };
    case BookingStatus.CHECKED_OUT: return { label: "Đã Check-out", color: "text-gray-600 bg-gray-100" };
    case BookingStatus.CANCELLED: return { label: "Đã hủy", color: "text-red-600 bg-red-50" };
    case BookingStatus.REFUNDED: return { label: "Đã hoàn tiền", color: "text-orange-600 bg-orange-50" };
    default: return { label: status, color: "text-gray-600 bg-gray-50" };
  }
}

export default function RecentActivities({ hotelBranchId }: { hotelBranchId: number }) {
  const { data, isLoading, isError } = useBookings({
    hotelBranchId,
    page: 0,
    size: 5,
    sortBy: "createdAt",
    direction: "desc"
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  if (isError || !data || data.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-gray-400">
        <Activity className="w-10 h-10 mb-3 opacity-30" />
        <p>Chưa có hoạt động nào được ghi nhận</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.items.map((booking) => {
        const statusConfig = getBookingStatusConfig(booking.status);
        return (
          <div key={booking.id} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-xl border border-gray-100">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-semibold text-gray-900">{booking.customerName}</span>
                <span className="text-xs text-gray-500 bg-white border border-gray-200 px-2 py-0.5 rounded-full">{booking.bookingCode}</span>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">Đã đặt <span className="font-medium text-gray-700">{booking.roomName}</span></p>
            </div>
            <div className="text-right">
              <p className="font-semibold text-emerald-600">{formatCurrency(booking.finalPrice)}</p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDistanceToNow(new Date(booking.createdAt), { addSuffix: true, locale: vi })}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
