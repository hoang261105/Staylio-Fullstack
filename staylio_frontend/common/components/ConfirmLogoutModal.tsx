import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { useTranslation } from "react-i18next";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
};

export default function ConfirmLogoutModal({
  open,
  onClose,
  onConfirm,
  isLoading
}: Props) {
  const { t } = useTranslation();
  return (
    <AlertDialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('components.confirmLogoutModal.title', 'Xác nhận đăng xuất')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('components.confirmLogoutModal.description', 'Bạn có chắc chắn muốn đăng xuất không?')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onClose} disabled={isLoading}>{t('components.confirmLogoutModal.cancel', 'Hủy')}</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => { e.preventDefault(); onConfirm(); }} disabled={isLoading} className="bg-red-500 hover:bg-red-600 min-w-[110px]">
            {isLoading ? "Đang đăng xuất..." : t('components.confirmLogoutModal.confirm', 'Đăng xuất')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}