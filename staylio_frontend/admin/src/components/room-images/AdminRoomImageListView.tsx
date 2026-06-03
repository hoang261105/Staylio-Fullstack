import { Image as ImageIcon, Building2, MapPin, Bed, CheckCircle2, Clock, XCircle, Trash2, Star, Eye, Check } from "lucide-react";
import Pagination from "@common/components/Pagination";
import { ImageStatus } from "@common/enums/ImageStatus";
import type { RoomImageAdminResponse } from "@common/interfaces/response/RoomImageAdminResponse";

interface AdminRoomImageListViewProps {
  roomImages: RoomImageAdminResponse[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  totalElements: number;
  onPageChange: (page: number) => void;
  onViewDetail: (imageId: number) => void;
  onApprove: (imageId: number, roomName: string, roomNumber: string) => void;
  onDelete: (imageId: number, roomName: string, roomNumber: string) => void;
}

export default function AdminRoomImageListView({
  roomImages,
  isLoading,
  page,
  totalPages,
  totalElements,
  onPageChange,
  onViewDetail,
  onApprove,
  onDelete,
}: AdminRoomImageListViewProps) {
  const getStatusBadge = (status: ImageStatus) => {
    switch (status) {
      case ImageStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã xác nhận
          </span>
        );
      case ImageStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Chờ duyệt
          </span>
        );
      case ImageStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Bị từ chối
          </span>
        );
      case ImageStatus.DELETED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <Trash2 className="w-3.5 h-3.5" />
            Đã xóa
          </span>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
        <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-medium">
          Đang tải danh sách hình ảnh...
        </p>
      </div>
    );
  }

  if (roomImages.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
        <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
        <h3 className="text-lg font-bold text-gray-900 mb-1">
          Không tìm thấy hình ảnh nào
        </h3>
        <p className="text-gray-500 max-w-md">
          Thử thay đổi bộ lọc tìm kiếm hoặc các cấp thương hiệu, chi nhánh để
          tìm được kết quả mong muốn.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {roomImages.map((img: RoomImageAdminResponse) => (
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
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate" title={img.hotelBranchName}>
                      {img.hotelBranchName}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                    <Building2 className="w-3.5 h-3.5 text-gray-400" />
                    <span className="truncate" title={img.ownerName}>
                      Chủ thương hiệu: {img.ownerName}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                <div className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
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
                const showApprove = img.status === ImageStatus.PENDING;
                const showDelete = img.status === ImageStatus.REJECTED;

                let colsClass = "grid-cols-3";
                if (showApprove && showDelete) {
                  colsClass = "grid-cols-3";
                } else if (!showApprove && showDelete) {
                  colsClass = "grid-cols-2";
                } else if (!showApprove && !showDelete) {
                  colsClass = "grid-cols-1";
                }

                return (
                  <div
                    className={`pt-3 border-t border-gray-100 grid ${colsClass} gap-2`}
                  >
                    <button
                      onClick={() => onViewDetail(img.id)}
                      className="flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 active:scale-95 transition-all cursor-pointer"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Chi tiết</span>
                    </button>

                    {showApprove && (
                      <button
                        onClick={() =>
                          onApprove(img.id, img.roomName, img.roomNumber)
                        }
                        className="flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
                        title="Duyệt hình ảnh"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Duyệt</span>
                      </button>
                    )}

                    {showDelete && (
                      <button
                        onClick={() =>
                          onDelete(img.id, img.roomName, img.roomNumber)
                        }
                        className="flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all cursor-pointer"
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

      {totalPages > 1 && (
        <div className="p-4 bg-white rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 shadow-sm">
          <div>
            Hiển thị{" "}
            <span className="font-medium text-gray-900">{roomImages.length}</span>{" "}
            trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span>{" "}
            hình ảnh phòng
          </div>
          <Pagination
            page={page}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
