/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../../common/enums/RoomStatus";
import { Button } from "../../../../common/components/ui/button";

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
      <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Cập nhật trạng thái phòng</h3>
          <p className="text-muted-foreground mb-4">
            Đang cập nhật trạng thái cho phòng <span className="font-semibold text-foreground">{room.roomName}</span>.
          </p>
          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Trạng thái mới</label>
            <div className="relative">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as RoomStatus)}
                className="w-full box-border px-4 py-2.5 border border-input rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors bg-background text-foreground appearance-none"
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <div className="px-6 py-4 bg-muted/50 flex justify-end gap-3 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isToggling}
          >
            Hủy
          </Button>
          <Button
            onClick={() => onConfirm(selectedStatus)}
            disabled={isToggling || selectedStatus === room.status}
            className="flex items-center gap-2"
          >
            {isToggling ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
