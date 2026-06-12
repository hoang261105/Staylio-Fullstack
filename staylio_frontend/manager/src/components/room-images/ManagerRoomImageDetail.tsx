import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Bed,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Star,
  Check,
  X,
  ShieldCheck,
} from "lucide-react";
import { useRoomImageId } from "@common/hooks/useRoomImage";
import { ImageStatus } from "@common/enums/ImageStatus";
import type { RoomImageDetailProps } from "@common/interfaces";
import ManagerLayout from "../../layout/ManagerLayout";
import ConfirmRoomImageStatusModal from "@common/components/ConfirmRoomImageStatusModal";
import { Button } from "@common/components/ui/button";

export default function ManagerRoomImageDetail({
  imageId: propsImageId,
  onClose,
  role
}: RoomImageDetailProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const imageId = propsImageId !== undefined ? propsImageId : Number(id);

  const { data: roomImageData, isLoading } = useRoomImageId(imageId);

  const imageDetail = roomImageData;

  const isManager = role === "manager" || window.location.pathname.includes("/manager");

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmStatus, setConfirmStatus] = useState<ImageStatus | null>(null);

  const handleApprove = () => {
    setConfirmStatus(ImageStatus.CONFIRMED);
    setConfirmModalOpen(true);
  };

  const handleRejectClick = () => {
    setConfirmStatus(ImageStatus.REJECTED);
    setConfirmModalOpen(true);
  };

  const handleDeleteClick = () => {
    setConfirmStatus(ImageStatus.DELETED);
    setConfirmModalOpen(true);
  };

  const handleSuccess = () => {
    if (confirmStatus === ImageStatus.DELETED) {
      if (onClose) {
        onClose();
      } else {
        navigate("/room-images");
      }
    }
  };

  const getStatusBadge = (status?: ImageStatus) => {
    switch (status) {
      case ImageStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            Đã xác nhận
          </span>
        );

      case ImageStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm animate-pulse">
            <Clock className="w-3.5 h-3.5 shrink-0" />
            Chờ duyệt
          </span>
        );

      case ImageStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 shadow-sm">
            <XCircle className="w-3.5 h-3.5 shrink-0" />
            Bị từ chối
          </span>
        );

      case ImageStatus.DELETED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
            <Trash2 className="w-3.5 h-3.5 shrink-0" />
            Đã xóa
          </span>
        );

      default:
        return null;
    }
  };

  const handleBack = () => {
    if (onClose) {
      onClose();
    } else {
      navigate("/room-images");
    }
  };

  if (isLoading || !imageDetail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground font-medium animate-pulse">
          Đang tải chi tiết hình ảnh...
        </p>
      </div>
    );
  }

  const content = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleBack}
          title="Quay lại danh sách"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        <div>
          <h1 className="text-2xl font-bold text-foreground leading-tight">
            Chi tiết hình ảnh phòng #{imageDetail.id}
          </h1>
          <p className="text-sm text-muted-foreground font-medium">
            Thông định đầy đủ và kiểm duyệt hình ảnh của phòng{" "}
            {imageDetail.roomNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-card rounded-2xl overflow-hidden border border-border shadow-sm p-4 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-muted group border border-border flex items-center justify-center">
            <img
              src={imageDetail.imageUrl}
              alt={imageDetail.roomName}
              className="w-full h-full object-cover group-hover:scale-[1.01] transition-transform duration-500 ease-out"
            />

            {imageDetail.isPrimary && (
              <div className="absolute top-4 left-4 bg-yellow-400 text-white text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-current" />
                Ảnh chính
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 text-xs text-muted-foreground gap-2">
            <span className="truncate">
              URL:{" "}
              <a
                href={imageDetail.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-primary hover:underline font-semibold"
              >
                {imageDetail.imageUrl}
              </a>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-4">
            <div className="pb-3 border-b border-border flex items-center justify-between">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <Bed className="w-4 h-4 text-primary" />
                Đặc điểm phòng
              </h4>

              {getStatusBadge(imageDetail.status)}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider block">
                  Tên phòng
                </span>
                <h3 className="font-bold text-foreground text-base leading-snug mt-0.5">
                  {imageDetail.roomName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                    Số phòng
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    {imageDetail.roomNumber}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-muted/50 border border-border">
                  <div className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider mb-0.5">
                    Mã hình ảnh
                  </div>
                  <div className="text-sm font-bold text-primary">
                    #{imageDetail.id}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-foreground font-semibold pl-1">
                  <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate" title={imageDetail.hotelBranchName}>
                    {imageDetail.hotelBranchName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-foreground font-semibold pl-1">
                  <Building2 className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="truncate" title={imageDetail.ownerName}>
                    Chủ thương hiệu: {imageDetail.ownerName}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-border flex items-center justify-between text-xs text-muted-foreground font-bold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>
                    Ngày tải lên:{" "}
                    {new Date(imageDetail.createdAt).toLocaleDateString(
                      "vi-VN"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {imageDetail.status === ImageStatus.REJECTED &&
            imageDetail.rejectionReason && (
              <div className="bg-destructive/10 rounded-2xl p-4 border border-destructive/20 text-sm text-destructive leading-relaxed font-semibold space-y-1.5 shadow-sm">
                <strong className="text-destructive font-bold uppercase tracking-wider block text-xs">
                  Lý do từ chối kiểm duyệt:
                </strong>
                <p className="text-sm text-destructive font-medium bg-background p-3 rounded-xl border border-destructive/20 mt-1 shadow-sm leading-relaxed">
                  {imageDetail.rejectionReason}
                </p>
              </div>
            )}

          <div className="bg-card rounded-2xl p-5 border border-border shadow-sm space-y-4">
            <div className="pb-3 border-b border-border">
              <h4 className="font-bold text-foreground flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-primary" />
                Thao tác hình ảnh phòng
              </h4>
            </div>

            <div className="space-y-3">
              {!isManager && imageDetail.status === ImageStatus.PENDING && (
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={handleApprove}
                    className="flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    Duyệt ảnh
                  </Button>

                  <Button
                    variant="destructive"
                    onClick={handleRejectClick}
                    className="flex items-center justify-center gap-1.5 bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive"
                  >
                    <X className="w-4 h-4" />
                    Từ chối ảnh
                  </Button>
                </div>
              )}

              {!isManager && imageDetail.status !== ImageStatus.PENDING && (
                <div className="p-3 bg-muted rounded-xl border border-border text-center text-xs text-muted-foreground font-semibold leading-relaxed">
                  Hình ảnh này đã được kiểm duyệt và chuyển sang trạng thái{" "}
                  <strong>{imageDetail.status}</strong>.
                </div>
              )}

              {isManager && (
                <div className="p-3 bg-muted rounded-xl border border-border text-center text-xs text-muted-foreground font-semibold leading-relaxed">
                  Trạng thái kiểm duyệt hiện tại:{" "}
                  <strong className="text-foreground">{imageDetail.status}</strong>.
                </div>
              )}

              {((isManager && imageDetail.status !== ImageStatus.DELETED) ||
                (!isManager && imageDetail.status === ImageStatus.REJECTED)) && (
                  <Button
                    variant="outline"
                    onClick={handleDeleteClick}
                    className="w-full text-destructive hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Xóa hình ảnh phòng
                  </Button>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
  const renderWithModal = (
    <>
      {content}
      <ConfirmRoomImageStatusModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        imageId={imageDetail.id}
        status={confirmStatus}
        roomName={imageDetail.roomName}
        roomNumber={imageDetail.roomNumber}
        onSuccess={handleSuccess}
      />
    </>
  );

  if (onClose) return renderWithModal;

  return <ManagerLayout>{renderWithModal}</ManagerLayout>;
}