import {
  Star,
  Bed,
  MapPin,
  Building2,
  Calendar,
  Eye,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { ImageStatus } from "@common/enums/ImageStatus";
import type { RoomImageAdminResponse } from "@common/interfaces/response/RoomImageAdminResponse";

interface RoomImageListViewProps {
  roomImages: RoomImageAdminResponse[];
  onViewDetail: (id: number) => void;
  onDelete: (img: RoomImageAdminResponse) => void;
}

export default function RoomImageListView({
  roomImages,
  onViewDetail,
  onDelete,
}: RoomImageListViewProps) {
  const getStatusBadge = (status?: ImageStatus) => {
    switch (status) {
      case ImageStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-green-50 text-green-700 border border-green-200 shadow-sm">
            <CheckCircle2 className="w-3 h-3 shrink-0" />
            Đã xác nhận
          </span>
        );
      case ImageStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200 shadow-sm">
            <Clock className="w-3 h-3 shrink-0" />
            Chờ duyệt
          </span>
        );
      case ImageStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-700 border border-red-200 shadow-sm">
            <XCircle className="w-3 h-3 shrink-0" />
            Từ chối
          </span>
        );
      case ImageStatus.DELETED:
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-100 text-gray-600 border border-gray-200 shadow-sm">
            <Trash2 className="w-3 h-3 shrink-0" />
            Đã xóa
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {roomImages.map((img) => (
        <div
          key={img.id}
          className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col"
        >
          <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
            <img
              src={img.imageUrl}
              alt={img.roomName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
              <div className="flex items-start justify-between w-full">
                {img.isPrimary ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm">
                    <Star className="w-3 h-3 fill-current" />
                    Ảnh chính
                  </span>
                ) : (
                  <div />
                )}
                <div className="pointer-events-auto">
                  {getStatusBadge(img.status)}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <Bed className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-1">
                    {img.roomName}
                  </h4>
                  <p className="text-xs font-semibold text-gray-500 mt-0.5">
                    Mã phòng:{" "}
                    <span className="text-gray-900">{img.roomNumber}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pl-7">
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate" title={img.hotelBranchName}>
                    {img.hotelBranchName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                  <Building2 className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                  <span className="truncate" title={img.ownerName}>
                    Chủ thương hiệu: {img.ownerName}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {new Date(img.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <span className="text-gray-300">ID: {img.id}</span>
            </div>

            {img.status === ImageStatus.REJECTED && img.rejectionReason && (
              <div className="mt-2 p-2 bg-red-50/50 rounded-lg border border-red-100 text-[11px] text-red-700 leading-relaxed font-medium">
                <strong className="text-red-800">Lý do từ chối: </strong>
                {img.rejectionReason}
              </div>
            )}

            {(() => {
              const showDelete = img.status !== ImageStatus.DELETED;
              const colsClass = showDelete ? "grid-cols-2" : "grid-cols-1";

              return (
                <div className={`pt-3 border-t border-gray-100 grid ${colsClass} gap-2`}>
                  <button
                    onClick={() => onViewDetail(img.id)}
                    className="flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 active:scale-95 transition-all cursor-pointer"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi tiết</span>
                  </button>

                  {showDelete && (
                    <button
                      onClick={() => onDelete(img)}
                      className="flex items-center justify-center gap-1.5 py-2 px-1 text-xs font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all cursor-pointer"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </button>
                  )}
                </div>
              );
            })()}
          </div>
        </div>
      ))}
    </div>
  );
}
