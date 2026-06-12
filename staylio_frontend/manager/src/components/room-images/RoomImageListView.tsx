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
import { Button } from "@common/components/ui/button";

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
          className="group bg-card text-foreground rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300 flex flex-col"
        >
          <div className="relative aspect-4/3 w-full overflow-hidden bg-muted">
            <img
              src={img.imageUrl}
              alt={img.roomName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />

            <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
              <div className="flex items-start justify-between w-full">
                {img.isPrimary ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary text-primary-foreground shadow-lg shadow-primary/20 backdrop-blur-sm">
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
                <Bed className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-foreground text-sm leading-snug group-hover:text-primary transition-colors line-clamp-1">
                    {img.roomName}
                  </h4>
                  <p className="text-xs font-semibold text-muted-foreground mt-0.5">
                    Mã phòng:{" "}
                    <span className="text-foreground">{img.roomNumber}</span>
                  </p>
                </div>
              </div>

              <div className="space-y-1.5 pl-7">
                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                  <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate" title={img.hotelBranchName}>
                    {img.hotelBranchName}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-foreground font-medium">
                  <Building2 className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="truncate" title={img.ownerName}>
                    Chủ thương hiệu: {img.ownerName}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-border flex items-center justify-between text-[11px] text-muted-foreground font-medium">
              <div className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {new Date(img.createdAt).toLocaleDateString("vi-VN")}
                </span>
              </div>
              <span className="text-muted-foreground/50">ID: {img.id}</span>
            </div>

            {img.status === ImageStatus.REJECTED && img.rejectionReason && (
              <div className="mt-2 p-2 bg-destructive/10 rounded-lg border border-destructive/20 text-[11px] text-destructive leading-relaxed font-medium">
                <strong className="text-destructive font-bold">Lý do từ chối: </strong>
                {img.rejectionReason}
              </div>
            )}

            {(() => {
              const showDelete = img.status !== ImageStatus.DELETED;
              const colsClass = showDelete ? "grid-cols-2" : "grid-cols-1";

              return (
                <div className={`pt-3 border-t border-border grid ${colsClass} gap-2`}>
                  <Button
                    variant="secondary"
                    onClick={() => onViewDetail(img.id)}
                    className="flex items-center justify-center gap-1.5 h-8 text-xs font-bold rounded-lg bg-primary/10 text-primary hover:bg-primary/20 w-full"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Chi tiết</span>
                  </Button>

                  {showDelete && (
                    <Button
                      variant="destructive"
                      onClick={() => onDelete(img)}
                      className="flex items-center justify-center gap-1.5 h-8 text-xs font-bold rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 hover:text-destructive w-full"
                      title="Xóa hình ảnh"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa</span>
                    </Button>
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
