import { X, MapPin, Tag, Users, Maximize, Bed, CheckCircle, XCircle, FileText, Info } from "lucide-react";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../../common/enums/RoomStatus";
import { RoomType } from "../../../../common/enums/RoomType";

interface RoomDetailModalProps {
  room: RoomResponse;
  onClose: () => void;
}

export default function RoomDetailModal({ room, onClose }: RoomDetailModalProps) {
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
    [RoomType.STANDARD]: "Standard",
    [RoomType.DELUXE]: "Deluxe",
    [RoomType.SUITE]: "Suite",
    [RoomType.VIP]: "VIP",
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Info className="w-5 h-5 text-[#0066FF]" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chi tiết phòng</h2>
              <p className="text-sm text-gray-500">Thông tin đầy đủ của phòng {room?.roomNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - Image & Basic Info */}
            <div className="w-full md:w-1/3 space-y-6 shrink-0">
              {/* Image */}
              <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
                <div className="aspect-square w-full rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden border border-gray-100 mb-4 p-4">
                  <img src="/slogan.png" alt="Room Logo" className="w-full h-full object-contain" />
                </div>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{room?.roomName}</h3>
                    <div className="flex items-center gap-1.5 mt-1 text-sm text-gray-500">
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span className="truncate" title={room?.hotelBranchName}>
                        {room?.hotelBranchName}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                        statusColors[room?.status] || "bg-gray-50 text-gray-700 border-gray-200"
                      }`}
                    >
                      {statusLabels[room?.status] || room?.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      Loại: {typeLabels[room?.roomType] || room?.roomType}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                      room?.isActive 
                        ? "bg-green-50 text-green-700 border-green-200" 
                        : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                      {room?.isActive ? "Đang hoạt động" : "Ngừng hoạt động"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#0066FF]" />
                  Thông tin giá
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Giá cơ bản:</span>
                    <span className="font-bold text-lg text-[#0066FF]">{room?.price?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Giá người lớn (phụ thu):</span>
                    <span className="font-medium text-gray-900">{room?.adultPrice?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Giá trẻ em (phụ thu):</span>
                    <span className="font-medium text-gray-900">{room?.childPrice?.toLocaleString("vi-VN")} ₫</span>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
                    {room?.isVoucherApplicable ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <XCircle className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={`text-sm ${room?.isVoucherApplicable ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                      {room?.isVoucherApplicable ? "Được phép áp dụng Voucher" : "Không áp dụng Voucher"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Properties Grid */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-50">Đặc điểm phòng</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      <Bed className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Thông tin giường</div>
                      <div className="text-sm font-semibold text-gray-900">{room?.bedInfo}</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      <Maximize className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Diện tích</div>
                      <div className="text-sm font-semibold text-gray-900">{room?.area} m²</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      <Users className="w-5 h-5 text-gray-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Sức chứa tiêu chuẩn</div>
                      <div className="text-sm font-semibold text-gray-900">{room?.capacity} khách</div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      <Users className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Sức chứa tối đa</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {room?.maxAdults} Người lớn, {room?.maxChildren} Trẻ em
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Mô tả chi tiết
                </h4>
                {room?.description ? (
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-50">
                    {room?.description}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic text-center py-6 bg-gray-50/50 rounded-lg border border-gray-50">
                    Phòng này chưa có mô tả chi tiết
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
