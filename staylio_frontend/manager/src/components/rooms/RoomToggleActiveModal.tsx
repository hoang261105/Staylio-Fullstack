import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";

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
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận cập nhật trạng thái</h3>
          <p className="text-gray-600">
            Bạn có chắc chắn muốn {room.isActive ? 'tạm ngừng hoạt động' : 'kích hoạt'} phòng{" "}
            <span className="font-semibold text-gray-900">{room.roomName}</span> không?
          </p>
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
            onClick={onConfirm}
            disabled={isToggling}
            className={`px-4 py-2 font-medium text-white rounded-lg transition-colors flex items-center gap-2 ${
              room.isActive
                ? 'bg-red-600 hover:bg-red-700'
                : 'bg-green-600 hover:bg-green-700'
            } disabled:opacity-50`}
          >
            {isToggling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              room.isActive ? 'Ngừng hoạt động' : 'Kích hoạt'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
