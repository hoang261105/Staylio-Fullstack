import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { Button } from "../../../../common/components/ui/button";

interface RoomToggleActiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isToggling: boolean;
  room: RoomResponse | null;
}

export default function RoomToggleActiveModal({
  isOpen,
  onClose,
  onConfirm,
  isToggling,
  room,
}: RoomToggleActiveModalProps) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-card text-foreground rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-2">Xác nhận cập nhật trạng thái</h3>
          <p className="text-muted-foreground">
            Bạn có chắc chắn muốn {room.isActive ? 'tạm ngừng hoạt động' : 'kích hoạt'} phòng{" "}
            <span className="font-semibold text-foreground">{room.roomName}</span> không?
          </p>
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
            variant={room.isActive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={isToggling}
            className="flex items-center gap-2"
          >
            {isToggling ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              room.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
