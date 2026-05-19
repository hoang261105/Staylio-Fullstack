/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/rules-of-hooks */
import { AlertTriangle, CheckCircle, XCircle, X, Power } from "lucide-react";
import type { UtilityResponse } from "../../../../common/interfaces/response/UtilityResponse";
import { useUpdateActiveMutation } from "../../../../common/hooks/useUtilities";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";

interface ConfirmUtilityStatusModalProps {
  utility: UtilityResponse | null;
  onClose: () => void;
}

export default function ConfirmUtilityStatusModal({
  utility,
  onClose,
}: ConfirmUtilityStatusModalProps) {
  if (!utility) return null;

  const isActivating = utility.isDeleted;

  const { mutate, isPending } = useUpdateActiveMutation();
  const Icon = getUtilityIcon(utility.iconName);

  const handleConfirm = () => {
    mutate(utility.id, {
      onSuccess: () => {
        onClose();
      },
    });
  };

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
        {/* Header */}
        <div
          className={`px-6 py-5 flex items-center justify-between border-b ${
            isActivating
              ? "border-green-100 bg-green-50"
              : "border-red-100 bg-red-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isActivating
                  ? "bg-green-100 text-green-600"
                  : "bg-red-100 text-red-500"
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                {isActivating
                  ? "Kích hoạt tiện ích"
                  : "Ngừng hoạt động tiện ích"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Xác nhận thay đổi trạng thái hoạt động
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-5">
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              isActivating
                ? "bg-green-50 border-green-200 text-green-800"
                : "bg-amber-50 border-amber-200 text-amber-800"
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              {isActivating
                ? "Tiện ích này sẽ được kích hoạt lại và hiển thị cho các phòng/khách sạn trên hệ thống."
                : "Tiện ích này sẽ ngừng hoạt động. Khách hàng sẽ không thể thấy tiện ích này nữa cho đến khi kích hoạt lại."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Tiện ích
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  !utility.isDeleted
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-red-50 text-red-700 border-red-200"
                }`}
              >
                {!utility.isDeleted ? "Đang hoạt động" : "Ngừng hoạt động"}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded-lg flex items-center justify-center shrink-0 border border-blue-100 p-2">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold text-gray-900 text-sm">
                  {utility.title}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-70">
                  {utility.description || "Không có mô tả"}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center gap-3">
              <div className="flex-1 flex flex-col items-center gap-1.5 bg-white rounded-lg p-2.5 border border-gray-200">
                {!utility.isDeleted ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-[10px] font-medium text-gray-500 text-center">
                  Hiện tại
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    !utility.isDeleted ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {!utility.isDeleted ? "HOẠT ĐỘNG" : "NGỪNG HOẠT ĐỘNG"}
                </span>
              </div>

              <div className="text-gray-300 text-xl font-light">→</div>

              <div
                className={`flex-1 flex flex-col items-center gap-1.5 rounded-lg p-2.5 border ${
                  isActivating
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
                {isActivating ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-400" />
                )}
                <span className="text-[10px] font-medium text-gray-500 text-center">
                  Sau khi xác nhận
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    isActivating ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {isActivating ? "HOẠT ĐỘNG" : "NGỪNG HOẠT ĐỘNG"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            disabled={isPending}
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            Hủy bỏ
          </button>
          <button
            onClick={handleConfirm}
            disabled={isPending}
            className={`px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed ${
              isActivating
                ? "bg-green-500 hover:bg-green-600 shadow-green-500/25"
                : "bg-red-500 hover:bg-red-600 shadow-red-500/25"
            }`}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <Power className="w-4 h-4" />
                <span>
                  {isActivating ? "Xác nhận kích hoạt" : "Xác nhận vô hiệu"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
