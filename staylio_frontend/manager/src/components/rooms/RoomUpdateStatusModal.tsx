/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../../common/enums/RoomStatus";

interface RoomUpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newStatus: RoomStatus) => void;
  isToggling: boolean;
  room: RoomResponse | null;
}

export default function RoomUpdateStatusModal({
  isOpen,
  onClose,
  onConfirm,
  isToggling,
  room,
}: RoomUpdateStatusModalProps) {
  const [selectedStatus, setSelectedStatus] = useState<RoomStatus>(RoomStatus.AVAILABLE);

  useEffect(() => {
    if (room && isOpen) {
      setSelectedStatus(room.status);
    }
  }, [room, isOpen]);

  if (!isOpen || !room) return null;

  const statusOptions = [
    { value: RoomStatus.AVAILABLE, label: "Trống (Có sẵn)" },
    { value: RoomStatus.OCCUPIED, label: "Đang sử dụng" },
    { value: RoomStatus.RESERVED, label: "Đã đặt trước" },
    { value: RoomStatus.MAINTENANCE, label: "Bảo trì" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Cập nhật trạng thái phòng</h3>
          <p className="text-gray-600 mb-4">
            Đang cập nhật trạng thái cho phòng <span className="font-semibold text-gray-900">{room.roomName}</span>.
          </p>
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái mới</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RoomStatus)}
                className="w-full box-border px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors bg-white appearance-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-gray-50 flex justify-end gap-3 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-200 rounded-lg transition-colors"
            disabled={isToggling}
          >
            Hủy
          </button>
          <button
            onClick={() => onConfirm(selectedStatus)}
            disabled={isToggling || selectedStatus === room.status}
            className="px-4 py-2 font-medium text-white bg-[#0066FF] hover:bg-[#0052CC] rounded-lg transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isToggling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
