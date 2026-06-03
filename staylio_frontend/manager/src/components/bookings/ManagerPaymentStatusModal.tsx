import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { PaymentStatus } from "@common/enums/PaymentStatus";
import { BookingStatus } from "@common/enums/BookingStatus";
import { useUpdatePaymentStatusMutation } from "@common/hooks/useBookings";
import { paymentStatusLabels, bookingStatusLabels } from "@common/utils/booking.util";
import type { BookingResponse } from "@common/interfaces/response/BookingResponse";

interface ManagerPaymentStatusModalProps {
  booking: BookingResponse | null;
  onClose: () => void;
}

export default function ManagerPaymentStatusModal({ booking, onClose }: ManagerPaymentStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<PaymentStatus | "">("");
  const [selectedBookingStatus, setSelectedBookingStatus] = useState<BookingStatus | "">("");

  useEffect(() => {
    if (booking) {
      setSelectedStatus(booking.paymentStatus);
      setSelectedBookingStatus(booking.status);
    }
  }, [booking]);

  const { mutate: updatePaymentStatus, isPending } = useUpdatePaymentStatusMutation(booking?.id || 0);

  if (!booking) return null;

  const handleUpdate = () => {
    if (!selectedStatus || !selectedBookingStatus) return;
    updatePaymentStatus(
      {
        paymentStatus: selectedStatus as PaymentStatus,
        bookingStatus: selectedBookingStatus as BookingStatus
      },
      {
        onSuccess: () => {
          onClose();
        },
      }
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">Cập nhật thanh toán</h3>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-gray-600 mb-4">
          Cập nhật trạng thái thanh toán cho đơn đặt phòng <strong className="text-[#0066FF]">{booking.bookingCode}</strong>
        </p>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái đơn đặt phòng</label>
            <select
              value={selectedBookingStatus}
              onChange={(e) => setSelectedBookingStatus(e.target.value as BookingStatus)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="" disabled>Chọn trạng thái đơn</option>
              {Object.values(BookingStatus).map((status) => (
                <option key={status} value={status}>
                  {bookingStatusLabels[status] || status}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Trạng thái thanh toán mới</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as PaymentStatus)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all text-sm font-medium text-gray-700 cursor-pointer"
            >
              <option value="" disabled>Chọn trạng thái</option>
              {Object.values(PaymentStatus).map((status) => (
                <option key={status} value={status}>
                  {paymentStatusLabels[status] || status}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleUpdate}
            disabled={
              isPending || 
              !selectedStatus || 
              !selectedBookingStatus || 
              (selectedStatus === booking.paymentStatus && selectedBookingStatus === booking.status)
            }
            className="px-5 py-2.5 text-sm font-medium text-white bg-[#0066FF] rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm shadow-blue-500/20"
          >
            {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
}
