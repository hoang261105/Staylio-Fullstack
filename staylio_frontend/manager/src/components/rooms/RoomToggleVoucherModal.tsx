import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";

interface RoomToggleVoucherModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isToggling: boolean;
  room: RoomResponse | null;
}

export default function RoomToggleVoucherModal({
  isOpen,
  onClose,
  onConfirm,
  isToggling,
  room,
}: RoomToggleVoucherModalProps) {
  if (!isOpen || !room) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Xác nhận cập nhật Voucher</h3>
          <p className="text-gray-600">
            Bạn có chắc chắn muốn {room.isVoucherApplicable ? 'hủy áp dụng voucher' : 'cho phép áp dụng voucher'} đối với phòng{" "}
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
              room.isVoucherApplicable
                ? 'bg-orange-600 hover:bg-orange-700'
                : 'bg-blue-600 hover:bg-blue-700'
            } disabled:opacity-50`}
          >
            {isToggling ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Đang xử lý...
              </>
            ) : (
              room.isVoucherApplicable ? 'Hủy Voucher' : 'Áp dụng Voucher'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
