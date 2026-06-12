/* eslint-disable react-hooks/rules-of-hooks */
import { AlertTriangle, CheckCircle, XCircle, X, Power } from "lucide-react";
import { VoucherStatus } from "@common/enums/VoucherStatus";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { useUpdateStatusVoucherMutation } from "@common/hooks/useVouchers";
import { Button } from "@common/components/ui/button";

interface VoucherToggleStatusModalProps {
  voucher: VoucherResponse | null;
  onClose: () => void;
}

export default function VoucherToggleStatusModal({
  voucher,
  onClose,
}: VoucherToggleStatusModalProps) {
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
        className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`px-6 py-5 flex items-center justify-between border-b ${
            isActivating
              ? "border-green-500/20 bg-green-500/10"
              : "border-red-500/20 bg-red-500/10"
          }`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isActivating
                  ? "bg-green-500/20 text-green-600 dark:text-green-500"
                  : "bg-red-500/20 text-red-600 dark:text-red-500"
              }`}
            >
              <Power className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">
                {isActivating ? "Kích hoạt Voucher" : "Vô hiệu hóa Voucher"}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                Xác nhận thay đổi trạng thái
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
          <div
            className={`flex items-start gap-3 p-4 rounded-xl border ${
              isActivating
                ? "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-400"
                : "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-400"
            }`}
          >
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-sm leading-relaxed">
              {isActivating
                ? "Voucher sẽ được kích hoạt và có thể được sử dụng bởi khách hàng."
                : "Voucher sẽ bị vô hiệu hóa và khách hàng sẽ không thể sử dụng cho đến khi được kích hoạt lại."}
            </p>
          </div>

          <div className="bg-muted/50 rounded-xl border border-border p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                Voucher
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${
                  voucher.status === VoucherStatus.ACTIVE
                    ? "bg-green-500/10 text-green-600 border-green-500/20 dark:text-green-400"
                    : "bg-muted text-muted-foreground border-border"
                }`}
              >
                {voucher.status === VoucherStatus.ACTIVE
                  ? "Đang hoạt động"
                  : "Đã vô hiệu hóa"}
              </span>
            </div>

            <div>
              <p className="font-semibold text-foreground text-sm">
                {voucher.title}
              </p>
              <span className="inline-flex mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
                {voucher.code}
              </span>
            </div>

            <div className="pt-2 border-t border-border flex items-center gap-3">
              <div className="flex-1 flex flex-col items-center gap-1.5 bg-card rounded-lg p-2.5 border border-border">
                {voucher.status === VoucherStatus.ACTIVE ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-muted-foreground" />
                )}
                <span className="text-[10px] font-medium text-muted-foreground text-center">
                  Hiện tại
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    voucher.status === VoucherStatus.ACTIVE
                      ? "text-green-500"
                      : "text-muted-foreground"
                  }`}
                >
                  {voucher.status === VoucherStatus.ACTIVE
                    ? "ACTIVE"
                    : "DISABLED"}
                </span>
              </div>

              <div className="text-muted-foreground text-xl font-light">→</div>

              <div
                className={`flex-1 flex flex-col items-center gap-1.5 rounded-lg p-2.5 border ${
                  isActivating
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                {isActivating ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <span className="text-[10px] font-medium text-muted-foreground text-center">
                  Sau khi xác nhận
                </span>
                <span
                  className={`text-[11px] font-semibold ${
                    isActivating ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {isActivating ? "ACTIVE" : "DISABLED"}
                </span>
              </div>
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
            variant={isActivating ? "default" : "destructive"}
            onClick={handleConfirm}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
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
          </Button>
        </div>
      </div>
    </div>
  );
}
