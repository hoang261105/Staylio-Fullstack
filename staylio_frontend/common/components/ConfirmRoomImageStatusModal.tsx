import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Trash2, X } from "lucide-react";
import { ImageStatus } from "@common/enums/ImageStatus";
import { useUpdateStatusImage } from "@common/hooks/useRoomImage";
import { InputField } from "@common/components/InputField";

interface ConfirmRoomImageStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageId: number | null;
  status: ImageStatus | null;
  roomName?: string;
  roomNumber?: string;
  onSuccess?: () => void;
}

export default function ConfirmRoomImageStatusModal({
  isOpen,
  onClose,
  imageId,
  status,
  roomName,
  roomNumber,
  onSuccess,
}: ConfirmRoomImageStatusModalProps) {
  if (!isOpen || !imageId || !status) return null;

  const [rejectionReason, setRejectionReason] = useState("");
  const [errorReason, setErrorReason] = useState("");

  const { mutate, isPending } = useUpdateStatusImage(imageId);

  const handleConfirm = () => {
    if (status === ImageStatus.REJECTED && !rejectionReason.trim()) {
      setErrorReason("Vui lòng nhập lý do từ chối kiểm duyệt!");
      return;
    }

    mutate(
      {
        status,
        rejectionReason: status === ImageStatus.REJECTED ? rejectionReason : "",
      },
      {
        onSuccess: () => {
          if (onSuccess) onSuccess();
          onClose();
        },
      }
    );
  };

  const getActionConfig = () => {
    switch (status) {
      case ImageStatus.CONFIRMED:
        return {
          title: "Duyệt hình ảnh",
          description: "Phê duyệt hình ảnh này hiển thị trên hệ thống",
          icon: <CheckCircle className="w-5 h-5 text-emerald-600" />,
          iconBg: "bg-emerald-100",
          headerBg: "bg-emerald-50 border-emerald-100",
          alertBg: "bg-emerald-50 border-emerald-200 text-emerald-800",
          alertText: "Hình ảnh sau khi được duyệt sẽ hiển thị công khai trên website đặt phòng của Staylio.",
          confirmBtn: "bg-[#0066FF] hover:bg-[#0052cc] shadow-blue-500/20",
          confirmText: "Xác nhận duyệt",
        };
      case ImageStatus.REJECTED:
        return {
          title: "Từ chối hình ảnh",
          description: "Từ chối phê duyệt hình ảnh phòng này",
          icon: <XCircle className="w-5 h-5 text-red-500" />,
          iconBg: "bg-red-100",
          headerBg: "bg-red-50 border-red-100",
          alertBg: "bg-amber-50 border-amber-200 text-amber-800",
          alertText: "Vui lòng cung cấp lý do từ chối rõ ràng để đối tác hiểu và tải lên hình ảnh phù hợp hơn.",
          confirmBtn: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
          confirmText: "Xác nhận từ chối",
        };
      case ImageStatus.DELETED:
        return {
          title: "Xóa hình ảnh",
          description: "Xóa vĩnh viễn hình ảnh khỏi phòng này",
          icon: <Trash2 className="w-5 h-5 text-red-500" />,
          iconBg: "bg-red-100",
          headerBg: "bg-red-50 border-red-100",
          alertBg: "bg-red-50 border-red-200 text-red-800",
          alertText: "Hành động này không thể hoàn tác. Hình ảnh này sẽ bị gỡ bỏ vĩnh viễn khỏi danh sách ảnh của phòng.",
          confirmBtn: "bg-red-500 hover:bg-red-600 shadow-red-500/20",
          confirmText: "Xác nhận xóa",
        };
      default:
        return {
          title: "Xác nhận thao tác",
          description: "Thay đổi trạng thái hình ảnh",
          icon: <AlertTriangle className="w-5 h-5 text-gray-500" />,
          iconBg: "bg-gray-100",
          headerBg: "bg-gray-50 border-gray-100",
          alertBg: "bg-gray-50 border-gray-200 text-gray-800",
          alertText: "Bạn có chắc chắn muốn thực hiện thao tác này?",
          confirmBtn: "bg-gray-800 hover:bg-gray-900",
          confirmText: "Xác nhận",
        };
    }
  };

  const config = getActionConfig();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{
        backgroundColor: "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 flex items-center justify-between border-b ${config.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg}`}>
              {config.icon}
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">{config.title}</h2>
              <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.alertBg}`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">{config.alertText}</p>
          </div>

          {(roomName || roomNumber) && (
            <div className="bg-gray-50 rounded-xl border border-gray-100 p-3.5 space-y-2">
              <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Thông tin hình ảnh
              </div>
              <div className="text-sm font-semibold text-gray-800">
                {roomName} <span className="text-gray-500 font-normal">({roomNumber})</span>
              </div>
              <div className="text-xs text-gray-500 font-medium">
                Mã ảnh: <span className="text-[#0066FF] font-bold">#{imageId}</span>
              </div>
            </div>
          )}

          {status === ImageStatus.REJECTED && (
            <div className="space-y-1.5 animate-in slide-in-from-top-2 duration-200">
              <InputField
                label="Lý do từ chối kiểm duyệt"
                value={rejectionReason}
                onChange={(e) => {
                  setRejectionReason(e.target.value);
                  setErrorReason("");
                }}
                required
                placeholder="Ví dụ: Hình ảnh mờ, sai kích thước hoặc có nội dung không phù hợp..."
                error={errorReason}
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${config.confirmBtn}`}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>{config.confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
