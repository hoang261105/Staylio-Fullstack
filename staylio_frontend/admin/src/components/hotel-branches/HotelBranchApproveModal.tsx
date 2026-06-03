import { BranchStatus } from "../../../../common/enums/BranchStatus";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../../../../common/components/ui/alert-dialog";

interface HotelBranchApproveModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (status: BranchStatus) => void;
}

export default function HotelBranchApproveModal({
  open,
  onClose,
  onConfirm,
}: HotelBranchApproveModalProps) {
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xét duyệt chi nhánh</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn vui lòng chọn hành động phê duyệt cho chi nhánh này. Hành động từ chối hoặc duyệt đều không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose}>Hủy</AlertDialogCancel>
          <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                onConfirm(BranchStatus.REJECTED);
              }}
              className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
            >
              Từ chối
            </AlertDialogAction>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault();
                onConfirm(BranchStatus.CONFIRMED);
              }}
              className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
            >
              Duyệt chi nhánh
            </AlertDialogAction>
          </div>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
