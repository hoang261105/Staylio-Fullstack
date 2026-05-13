import { X, Image as ImageIcon } from "lucide-react";
import type { HotelResponse } from "../../../../common/interfaces/response/HotelResponse";
import { HotelStatus } from "../../../../common/enums/HotelStatus";

interface HotelDetailModalProps {
  hotel: HotelResponse;
  onClose: () => void;
}

export default function HotelDetailModal({
  hotel,
  onClose,
}: HotelDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur z-10">
          <h2 className="text-2xl font-semibold text-gray-900">
            Chi tiết khách sạn
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex justify-center mb-6">
            <div className="w-full h-48 sm:h-64 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center">
              {hotel?.imageUrl ? (
                <img
                  src={hotel.imageUrl}
                  alt={hotel?.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-300" />
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">
            <div>
              <div className="text-sm text-gray-500 mb-1">Tên khách sạn</div>
              <div className="font-medium text-gray-900">{hotel?.name}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">ID</div>
              <div className="font-medium text-gray-900">{hotel?.id}</div>
            </div>
            <div>
              <div className="text-sm text-gray-500 mb-1">Chủ thương hiệu</div>
              <div className="font-medium text-gray-900">
                {hotel?.hostHotelName || "Không xác định"}
              </div>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">
                Trạng thái phê duyệt
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  hotel?.status === HotelStatus.PENDING
                    ? "bg-yellow-100 text-yellow-800"
                    : hotel?.status === HotelStatus.CONFIRMED
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                }`}
              >
                {hotel?.status === HotelStatus.PENDING
                  ? "Chờ duyệt"
                  : hotel?.status === HotelStatus.CONFIRMED
                    ? "Đã duyệt"
                    : "Từ chối"}
              </span>
            </div>

            <div>
              <div className="text-sm text-gray-500 mb-1">
                Trạng thái hoạt động
              </div>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                  hotel?.active === true
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {hotel?.active === true ? "Đang hoạt động" : "Tạm đóng"}
              </span>
            </div>

            <div className="sm:col-span-2">
              <div className="text-sm text-gray-500 mb-1">Mô tả</div>
              <div className="font-medium text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
                {hotel?.description || "Không có mô tả."}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200 flex gap-3 bg-gray-50 rounded-b-xl">
          <button className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-white shadow-sm">
            Chỉnh sửa
          </button>
          <button className="flex-1 px-4 py-2.5 bg-[#0066FF] text-white font-medium rounded-lg hover:bg-[#0052CC] shadow-sm">
            Xem trên web
          </button>
        </div>
      </div>
    </div>
  );
}
