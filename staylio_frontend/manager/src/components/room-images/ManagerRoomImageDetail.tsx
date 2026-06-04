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
        navigate(isManager ? "/room-images" : "/admin/room-images");
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
      navigate(isManager ? "/room-images" : "/admin/room-images");
    }
  };

  if (isLoading || !imageDetail) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-3">
        <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">
          Đang tải chi tiết hình ảnh...
        </p>
      </div>
    );
  }

  const content = (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="flex items-center gap-4">
        <button
          onClick={handleBack}
          className="p-2.5 bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 rounded-xl transition-all shadow-sm cursor-pointer flex items-center justify-center active:scale-95 shrink-0"
          title="Quay lại danh sách"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <h1 className="text-2xl font-bold text-gray-900 leading-tight">
            Chi tiết hình ảnh phòng #{imageDetail.id}
          </h1>
          <p className="text-sm text-gray-500 font-medium">
            Thông tin đầy đủ và kiểm duyệt hình ảnh của phòng{" "}
            {imageDetail.roomNumber}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm p-4 space-y-4">
          <div className="relative aspect-4/3 w-full rounded-xl overflow-hidden bg-gray-50 group border border-gray-100 flex items-center justify-center">
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

          <div className="flex flex-col sm:flex-row sm:items-center justify-between px-1 text-xs text-gray-400 gap-2">
            <span className="truncate">
              URL:{" "}
              <a
                href={imageDetail.imageUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#0066FF] hover:underline font-semibold"
              >
                {imageDetail.imageUrl}
              </a>
            </span>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100 flex items-center justify-between">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Bed className="w-4 h-4 text-[#0066FF]" />
                Đặc điểm phòng
              </h4>

              {getStatusBadge(imageDetail.status)}
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">
                  Tên phòng
                </span>
                <h3 className="font-bold text-gray-900 text-base leading-snug mt-0.5">
                  {imageDetail.roomName}
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                    Số phòng
                  </div>
                  <div className="text-sm font-bold text-gray-900">
                    {imageDetail.roomNumber}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-gray-50 border border-gray-100">
                  <div className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-0.5">
                    Mã hình ảnh
                  </div>
                  <div className="text-sm font-bold text-[#0066FF]">
                    #{imageDetail.id}
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold pl-1">
                  <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate" title={imageDetail.hotelBranchName}>
                    {imageDetail.hotelBranchName}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 font-semibold pl-1">
                  <Building2 className="w-4 h-4 text-gray-400 shrink-0" />
                  <span className="truncate" title={imageDetail.ownerName}>
                    Chủ thương hiệu: {imageDetail.ownerName}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-bold">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-gray-400" />
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
              <div className="bg-red-50/50 rounded-2xl p-4 border border-red-100 text-sm text-red-700 leading-relaxed font-semibold space-y-1.5 shadow-sm">
                <strong className="text-red-800 text-xs font-bold uppercase tracking-wider block">
                  Lý do từ chối kiểm duyệt:
                </strong>
                <p className="text-sm text-red-700 font-medium bg-white p-3 rounded-xl border border-red-100/50 mt-1 shadow-sm leading-relaxed">
                  {imageDetail.rejectionReason}
                </p>
              </div>
            )}

          <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
            <div className="pb-3 border-b border-gray-100">
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#0066FF]" />
                Thao tác hình ảnh phòng
              </h4>
            </div>

            <div className="space-y-3">
              {!isManager && imageDetail.status === ImageStatus.PENDING && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleApprove}
                    className="py-2.5 bg-[#0066FF] hover:bg-[#0052cc] text-white font-bold rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-md shadow-blue-500/10"
                  >
                    <Check className="w-4 h-4 stroke-[3px]" />
                    Duyệt ảnh
                  </button>

                  <button
                    onClick={handleRejectClick}
                    className="py-2.5 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:text-red-700 font-bold rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                  >
                    <X className="w-4 h-4" />
                    Từ chối ảnh
                  </button>
                </div>
              )}

              {!isManager && imageDetail.status !== ImageStatus.PENDING && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center text-xs text-gray-500 font-semibold leading-relaxed">
                  Hình ảnh này đã được kiểm duyệt và chuyển sang trạng thái{" "}
                  <strong>{imageDetail.status}</strong>.
                </div>
              )}

              {isManager && (
                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-center text-xs text-gray-500 font-semibold leading-relaxed">
                  Trạng thái kiểm duyệt hiện tại:{" "}
                  <strong className="text-gray-900">{imageDetail.status}</strong>.
                </div>
              )}

              {((isManager && imageDetail.status !== ImageStatus.DELETED) ||
                (!isManager && imageDetail.status === ImageStatus.REJECTED)) && (
                  <button
                    onClick={handleDeleteClick}
                    className="w-full py-2.5 bg-white border border-gray-200 text-red-600 hover:bg-red-50/50 font-bold rounded-lg text-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    Xóa hình ảnh phòng
                  </button>
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