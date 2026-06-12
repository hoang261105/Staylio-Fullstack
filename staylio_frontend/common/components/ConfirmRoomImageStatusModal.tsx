import { useState } from "react";
import { AlertTriangle, CheckCircle, XCircle, Trash2, X } from "lucide-react";
import { ImageStatus } from "@common/enums/ImageStatus";
import { useUpdateStatusImage } from "@common/hooks/useRoomImage";
import { InputField } from "@common/components/InputField";
import { Button } from "@common/components/ui/button";

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
          confirmVariant: "default" as const,
          confirmText: "Xác nhận duyệt",
        };
      case ImageStatus.REJECTED:
        return {
          title: "Từ chối hình ảnh",
          description: "Từ chối phê duyệt hình ảnh phòng này",
          icon: <XCircle className="w-5 h-5 text-destructive" />,
          iconBg: "bg-destructive/10",
          headerBg: "bg-destructive/5 border-destructive/10",
          alertBg: "bg-amber-50 border-amber-200 text-amber-800",
          alertText: "Vui lòng cung cấp lý do từ chối rõ ràng để đối tác hiểu và tải lên hình ảnh phù hợp hơn.",
          confirmVariant: "destructive" as const,
          confirmText: "Xác nhận từ chối",
        };
      case ImageStatus.DELETED:
        return {
          title: "Xóa hình ảnh",
          description: "Xóa vĩnh viễn hình ảnh khỏi phòng này",
          icon: <Trash2 className="w-5 h-5 text-destructive" />,
          iconBg: "bg-destructive/10",
          headerBg: "bg-destructive/5 border-destructive/10",
          alertBg: "bg-destructive/5 border-destructive/20 text-destructive",
          alertText: "Hành động này không thể hoàn tác. Hình ảnh này sẽ bị gỡ bỏ vĩnh viễn khỏi danh sách ảnh của phòng.",
          confirmVariant: "destructive" as const,
          confirmText: "Xác nhận xóa",
        };
      default:
        return {
          title: "Xác nhận thao tác",
          description: "Thay đổi trạng thái hình ảnh",
          icon: <AlertTriangle className="w-5 h-5 text-muted-foreground" />,
          iconBg: "bg-muted",
          headerBg: "bg-muted/50 border-border",
          alertBg: "bg-muted/50 border-border text-foreground",
          alertText: "Bạn có chắc chắn muốn thực hiện thao tác này?",
          confirmVariant: "default" as const,
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
        className="bg-card text-foreground rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={`px-6 py-4 flex items-center justify-between border-b ${config.headerBg}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.iconBg}`}>
              {config.icon}
            </div>
            <div>
              <h2 className="font-bold text-foreground text-base">{config.title}</h2>
              <p className="text-xs text-muted-foreground mt-0.5">{config.description}</p>
            </div>
          </div>
          <Button
            variant="ghost" size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="px-6 py-5 space-y-4">
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${config.alertBg}`}>
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">{config.alertText}</p>
          </div>

          {(roomName || roomNumber) && (
            <div className="bg-muted/50 rounded-xl border border-border p-3.5 space-y-2">
              <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                Thông tin hình ảnh
              </div>
              <div className="text-sm font-semibold text-foreground">
                {roomName} <span className="text-muted-foreground font-normal">({roomNumber})</span>
              </div>
              <div className="text-xs text-muted-foreground font-medium">
                Mã ảnh: <span className="text-primary font-bold">#{imageId}</span>
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

        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
          >
            Hủy bỏ
          </Button>
          <Button
            variant={config.confirmVariant}
            onClick={handleConfirm}
            disabled={isPending}
          >
            {isPending ? (
              <>
                <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Đang xử lý...</span>
              </>
            ) : (
              <>
                <span>{config.confirmText}</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
