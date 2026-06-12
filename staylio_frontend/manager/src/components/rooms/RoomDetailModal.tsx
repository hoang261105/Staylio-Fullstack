/* eslint-disable react-hooks/set-state-in-effect */
import { X, MapPin, Tag, Users, Maximize, Bed, CheckCircle, XCircle, FileText, Info, Plus, Star } from "lucide-react";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import type { RoomImageResponse } from "../../../../common/interfaces/response/RoomImageResponse";
import { RoomStatus } from "../../../../common/enums/RoomStatus";
import { RoomType } from "../../../../common/enums/RoomType";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";
import { useState, useEffect } from "react";
import { Button } from "../../../../common/components/ui/button";

interface RoomDetailModalProps {
  room: RoomResponse;
  onClose: () => void;
}

export default function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
  const [selectedImage, setSelectedImage] = useState<RoomImageResponse | null>(null);

  useEffect(() => {
    if (room?.images && room.images.length > 0) {
      const primary = room.images.find(img => img.isPrimary) || room.images[0];
      setSelectedImage(primary);
    } else {
      setSelectedImage(null);
    }
  }, [room]);

  const statusColors = {
    [RoomStatus.AVAILABLE]: "bg-green-50 text-green-700 border-green-200",
    [RoomStatus.OCCUPIED]: "bg-blue-50 text-blue-700 border-blue-200",
    [RoomStatus.MAINTENANCE]: "bg-yellow-50 text-yellow-700 border-yellow-200",
    [RoomStatus.RESERVED]: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const statusLabels = {
    [RoomStatus.AVAILABLE]: "Trống",
    [RoomStatus.OCCUPIED]: "Đang sử dụng",
    [RoomStatus.MAINTENANCE]: "Bảo trì",
    [RoomStatus.RESERVED]: "Đã đặt trước",
  };

  const typeLabels = {
    [RoomType.SINGLE]: "Phòng đơn",
    [RoomType.DOUBLE]: "Phòng đôi",
    [RoomType.SUITE]: "Suite",
    [RoomType.VIP]: "Phòng VIP",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-card text-foreground rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Info className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Chi tiết phòng</h2>
              <p className="text-sm text-muted-foreground">Thông tin đầy đủ của phòng {room?.roomNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Image & Basic Info */}
            <div className="w-full md:w-1/3 space-y-6 shrink-0">
              {/* Image */}
              <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
                <div className="relative aspect-4/3 w-full rounded-lg bg-muted flex items-center justify-center overflow-hidden border border-border mb-3">
                  <img src={selectedImage?.imageUrl || "/slogan.png"} alt="Room Logo" className={`w-full h-full ${selectedImage ? 'object-cover' : 'object-contain'}`} />
                  {selectedImage?.isPrimary && (
                    <div className="absolute top-2 left-2 bg-yellow-400 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 shadow-sm">
                      <Star className="w-3 h-3 fill-current" />
                      Ưu tiên
                    </div>
                  )}
                </div>

                {room?.images && room.images.length > 0 ? (
                  <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-thin scrollbar-thumb-muted">
                    {room.images.map((img) => (
                      <div
                        key={img.id}
                        onClick={() => setSelectedImage(img)}
                        className={`relative w-16 h-16 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${selectedImage?.id === img.id ? 'border-primary opacity-100' : 'border-transparent opacity-60 hover:opacity-100'}`}
                      >
                        <img src={img.imageUrl} alt="thumbnail" className="w-full h-full object-cover" />
                        {img.isPrimary && (
                          <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent flex items-end justify-end p-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current drop-shadow-md" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic text-center py-4 bg-muted/50 rounded-lg border border-border mb-4">
                    Phòng này chưa có ảnh nào
                  </div>
                )}

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{room?.roomName}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-muted-foreground">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate" title={room?.hotelBranchName}>
                        {room?.hotelBranchName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[room?.status] || "bg-muted text-muted-foreground border-border"
                        }`}
                    >
                      {statusLabels[room?.status] || room?.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      Loại: {typeLabels[room?.roomType] || room?.roomType}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${room?.isActive
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-destructive/10 text-destructive border-destructive/20"
                      }`}>
                      {room?.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Tag className="w-4 h-4 text-primary" />
                  Thông tin giá
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Giá cơ bản:</span>
                    <span className="font-bold text-lg text-primary">{room?.price?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Giá người lớn (phụ thu):</span>
                    <span className="font-medium text-foreground">{room?.adultPrice?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Giá trẻ em (phụ thu):</span>
                    <span className="font-medium text-foreground">{room?.childPrice?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-border">
                    {room?.isVoucherApplicable ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${room?.isVoucherApplicable ? 'text-green-600 font-medium' : 'text-muted-foreground'}`}>
                      {room?.isVoucherApplicable ? "Được phép áp dụng Voucher" : "Không áp dụng Voucher"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Properties Grid */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-4 pb-3 border-b border-border">Đặc điểm phòng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      <Bed className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Thông tin giường</div>
                      <div className="text-sm font-semibold text-foreground">{room?.bedInfo}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      <Maximize className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Diện tích</div>
                      <div className="text-sm font-semibold text-foreground">{room?.area} m²</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      <Users className="w-5 h-5 text-muted-foreground" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Sức chứa tiêu chuẩn</div>
                      <div className="text-sm font-semibold text-foreground">{room?.capacity} khách</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Sức chứa tối đa</div>
                      <div className="text-sm font-semibold text-foreground">
                        {room?.maxAdults} Người lớn, {room?.maxChildren} Trẻ em
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 pb-3 border-b border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Mô tả chi tiết
                </h4>
                {room?.description ? (
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/50 p-4 rounded-lg border border-border">
                    {room?.description}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic text-center py-6 bg-muted/50 rounded-lg border border-border">
                    Phòng này chưa có mô tả chi tiết
                  </div>
                )}
              </div>

              {/* Utilities */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
                  <h4 className="font-semibold text-foreground">Tiện ích phòng</h4>
                  <Button variant="secondary" size="sm" className="flex items-center gap-1.5 text-sm font-medium">
                    <Plus className="w-4 h-4" />
                    Thêm tiện ích
                  </Button>
                </div>
                {room?.utilities && room.utilities.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {room.utilities.map((util) => {
                      const Icon = getUtilityIcon(util.iconName);
                      return (
                        <div key={util.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-muted border border-border hover:bg-card hover:border-primary/50 transition-colors shadow-sm">
                          <div className="bg-card p-1.5 rounded-md shadow-sm shrink-0 border border-border">
                            <Icon className="w-4 h-4 text-muted-foreground" />
                          </div>
                          <span className="text-sm font-medium text-foreground truncate" title={util.title}>{util.title}</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic text-center py-6 bg-muted/50 rounded-lg border border-border">
                    Phòng này chưa có tiện ích nào
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/50 flex justify-end shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
