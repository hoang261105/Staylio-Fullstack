import { AlertTriangle, Trash2, X } from "lucide-react";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { useUpdateApprovalStatusVoucherMutation } from "@common/hooks/useVouchers";

interface AdminVoucherDeleteModalProps {
  voucher: VoucherResponse | null;
  onClose: () => void;
}

export default function AdminVoucherDeleteModal({
  voucher,
  onClose,
}: AdminVoucherDeleteModalProps) {
  if (!voucher) return null;

  const { mutate, isPending } = useUpdateApprovalStatusVoucherMutation(voucher.id);

  const handleConfirm = () => {
    mutate(ApprovalStatus.DELETED, {
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
        <div className="px-6 py-5 flex items-center justify-between border-b border-red-100 bg-red-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-red-100 text-red-500">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900 text-base">
                Xóa Voucher
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Xác nhận xóa hoàn toàn voucher này
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
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Bạn có chắc chắn muốn xóa voucher này không? Hành động này sẽ chuyển trạng thái của voucher thành <strong>DELETED</strong> và không thể hoàn tác.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                Mã giảm giá
              </span>
              <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-gray-200 text-gray-700 border border-gray-300">
                {voucher.code}
              </span>
            </div>

            <div>
              <p className="font-semibold text-gray-900 text-sm">
                {voucher.title}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Chi nhánh: <span className="font-semibold">{voucher.hotelBranchName}</span>
              </p>
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
            className="px-5 py-2.5 text-sm font-semibold text-white rounded-xl transition-all flex items-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed bg-red-500 hover:bg-red-600 shadow-red-500/25"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
