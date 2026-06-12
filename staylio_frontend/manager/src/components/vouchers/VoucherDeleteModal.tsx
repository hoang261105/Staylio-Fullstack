/* eslint-disable react-hooks/rules-of-hooks */
import { AlertTriangle, Trash2, X } from "lucide-react";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { useUpdateApprovalStatusVoucherMutation } from "@common/hooks/useVouchers";
import { Button } from "@common/components/ui/button";

interface VoucherDeleteModalProps {
  voucher: VoucherResponse | null;
  onClose: () => void;
}

export default function VoucherDeleteModal({
  voucher,
  onClose,
}: VoucherDeleteModalProps) {
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
        className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-5 flex items-center justify-between border-b border-destructive/20 bg-destructive/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-destructive/20 text-destructive">
              <Trash2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                Xóa Voucher
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Xác nhận xóa hoàn toàn voucher này
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-5">
          <div className="flex items-start gap-3 p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              Bạn có chắc chắn muốn xóa voucher này không? Hành động này sẽ chuyển trạng thái của voucher thành <strong className="text-foreground">DELETED</strong> và không thể hoàn tác.
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Mã giảm giá
              </span>
              <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
                {voucher.code}
              </span>
            </div>

            <div>
              <p className="font-semibold text-foreground text-sm">
                {voucher.title}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Chi nhánh: <span className="font-semibold text-foreground">{voucher.hotelBranchName}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Đang xóa...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>Xác nhận xóa</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
