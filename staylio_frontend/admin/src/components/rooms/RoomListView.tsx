import { Eye, MapPin, Tag, Users, Maximize, Bed } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../../common/enums/RoomStatus";
import { RoomType } from "../../../../common/enums/RoomType";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";

interface RoomListViewProps {
  rooms: RoomResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (room: RoomResponse) => void;
}

export default function RoomListView({
  rooms,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView
}: RoomListViewProps) {
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
    [RoomType.SINGLE]: "Single",
    [RoomType.DOUBLE]: "Double",
    [RoomType.SUITE]: "Suite",
    [RoomType.VIP]: "VIP",
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Phòng</th>
              <th className="px-6 py-4">Chi nhánh</th>
              <th className="px-6 py-4">Sức chứa & Tiện ích</th>
              <th className="px-6 py-4">Giá (VND)</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy phòng nào
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const primaryImg = room.images?.find(img => img.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl;
                        return (
                          <div className={`w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100 ${!primaryImg ? 'p-2' : ''}`}>
                            <img src={primaryImg || "/slogan.png"} alt="Room Image" className={`w-full h-full ${primaryImg ? 'object-cover' : 'object-contain'}`} />
                          </div>
                        );
                      })()}
                      <div>
                        <div className="font-semibold text-gray-900">{room.roomName}</div>
                        <div className="text-xs text-gray-500 mt-0.5 font-medium">Số phòng: {room.roomNumber}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 text-gray-600 uppercase tracking-wider">
                          {typeLabels[room.roomType] || room.roomType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1.5 max-w-37.5">
                      <MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" />
                      <span className="font-medium text-gray-700 truncate" title={room.hotelBranchName}>
                        {room.hotelBranchName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Users className="w-3.5 h-3.5 text-gray-400" />
                        <span>{room.capacity} khách (Tối đa {room.maxAdults} NL, {room.maxChildren} TE)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Bed className="w-3.5 h-3.5 text-gray-400" />
                        <span className="truncate max-w-37.5" title={room.bedInfo}>{room.bedInfo}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Maximize className="w-3.5 h-3.5 text-gray-400" />
                        <span>{room.area} m²</span>
                      </div>
                      {room.utilities && room.utilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-gray-100">
                          {room.utilities.map((util) => {
                            const Icon = getUtilityIcon(util.iconName);
                            return (
                              <div key={util.id} className="p-1 bg-gray-50 rounded-md border border-gray-100 text-gray-500" title={util.title}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-[#0066FF]">
                      {room.price.toLocaleString("vi-VN")} ₫
                    </div>
                    {room.isVoucherApplicable && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-sm w-fit">
                        <Tag className="w-3 h-3" />
                        <span>Áp dụng Voucher</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <button
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 cursor-pointer ${statusColors[room.status] || "bg-gray-50 text-gray-700 border-gray-200"
                          }`}
                        title="Cập nhật trạng thái phòng"
                      >
                        {statusLabels[room.status] || room.status}
                      </button>
                      {!room.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-50 text-red-600 border border-red-100">
                          Ngừng hoạt động
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(room)}
                        className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && rooms.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/50">
          <div>
            Hiển thị <span className="font-medium text-gray-900">{rooms.length}</span> trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span> phòng
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
