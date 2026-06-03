import { AlertTriangle, CheckCircle, XCircle, X, Power } from "lucide-react";
import { VoucherStatus } from "@common/enums/VoucherStatus";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { useUpdateStatusVoucherMutation } from "@common/hooks/useVouchers";

interface AdminVoucherToggleStatusModalProps {
  voucher: VoucherResponse | null;
  onClose: () => void;
}

export default function AdminVoucherToggleStatusModal({
  voucher,
  onClose,
}: AdminVoucherToggleStatusModalProps) {
  if (!voucher) return null;

  const isActivating = voucher.status === VoucherStatus.DISABLED;
  const targetStatus = isActivating
    ? VoucherStatus.ACTIVE
    : VoucherStatus.DISABLED;

  const { mutate, isPending } = useUpdateStatusVoucherMutation(voucher.id);

  const handleConfirm = () => {
    mutate(targetStatus, {
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
                {isActivating ? "Kích hoạt Voucher" : "Vô hiệu hóa Voucher"}
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Xác nhận thay đổi trạng thái
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
                ? "Voucher sẽ được kích hoạt và có thể được sử dụng bởi khách hàng."
                : "Voucher sẽ bị vô hiệu hóa và khách hàng sẽ không thể sử dụng cho đến khi được kích hoạt lại."}
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Voucher
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  voucher.status === VoucherStatus.ACTIVE
                    ? "bg-green-50 text-green-700 border-green-200"
                    : "bg-gray-100 text-gray-600 border-gray-200"
                }`}
              >
                {voucher.status === VoucherStatus.ACTIVE
                  ? "Đang hoạt động"
                  : "Đã vô hiệu hóa"}
              </span>
            </div>

            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {voucher.title}
              </p>
              <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700 border border-gray-300">
                {voucher.code}
              </span>
            </div>

            <div className="pt-2 border-t border-gray-200 flex items-center gap-3">
              <div className="flex-1 flex flex-col items-center gap-1.5 bg-white rounded-lg p-2.5 border border-gray-200">
                {voucher.status === VoucherStatus.ACTIVE ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-[10px] font-medium text-gray-500 text-center">
                  Hiện tại
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    voucher.status === VoucherStatus.ACTIVE
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {voucher.status === VoucherStatus.ACTIVE
                    ? "Đang hoạt động"
                    : "Đã vô hiệu hóa"}
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
                  {isActivating ? "Đang hoạt động" : "Đã vô hiệu hóa"}
                </span>
              </div>
            </div>
          </div>
        </div>

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
                  {isActivating ? "Xác nhận kích hoạt" : "Xác nhận vô hiệu hóa"}
                </span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
