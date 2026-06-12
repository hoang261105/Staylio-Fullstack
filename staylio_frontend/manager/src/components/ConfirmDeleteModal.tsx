import { Button } from "@common/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative bg-card text-foreground rounded-xl shadow-lg w-full max-w-sm p-6 z-10">
        <h2 className="text-lg font-semibold mb-2">
          Xác nhận xóa chi nhánh
        </h2>
        <p className="text-sm text-muted-foreground mb-6">
          Bạn có chắc chắn muốn xóa chi nhánh này không?
        </p>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Hủy
          </Button>

          <Button
            variant="destructive"
            onClick={onConfirm}
          >
            Xóa
          </Button>
        </div>
      </div>
    </div>
  );
}
