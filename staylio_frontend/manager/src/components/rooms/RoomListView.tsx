import { Eye, MapPin, Tag, Users, Maximize, Bed, Edit2, Power } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../../common/enums/RoomStatus";
import { RoomType } from "../../../../common/enums/RoomType";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";
import { Button } from "../../../../common/components/ui/button";

interface RoomListViewProps {
  rooms: RoomResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (room: RoomResponse) => void;
  onEdit: (room: RoomResponse) => void;
  onToggleActive: (room: RoomResponse) => void;
  onToggleVoucher: (room: RoomResponse) => void;
  onUpdateStatus: (room: RoomResponse) => void;
}

export default function RoomListView({
  rooms,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onToggleActive,
  onToggleVoucher,
  onUpdateStatus,
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
    <div className="bg-card text-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-foreground font-semibold">
            <tr>
              <th className="px-6 py-4">Phòng</th>
              <th className="px-6 py-4">Chi nhánh</th>
              <th className="px-6 py-4">Sức chứa & Tiện ích</th>
              <th className="px-6 py-4">Giá (VND)</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : rooms.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                  Không tìm thấy phòng nào
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {(() => {
                        const primaryImg = room.images?.find(img => img.isPrimary)?.imageUrl || room.images?.[0]?.imageUrl;
                        return (
                          <div className={`w-12 h-12 bg-muted rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-border ${!primaryImg ? 'p-2' : ''}`}>
                            <img src={primaryImg || "/slogan.png"} alt="Room Image" className={`w-full h-full ${primaryImg ? 'object-cover' : 'object-contain'}`} />
                          </div>
                        );
                      })()}
                      <div>
                        <div className="font-semibold text-foreground">{room.roomName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5 font-medium">Số phòng: {room.roomNumber}</div>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-medium bg-muted text-muted-foreground uppercase tracking-wider">
                          {typeLabels[room.roomType] || room.roomType}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1.5 max-w-37.5">
                      <MapPin className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                      <span className="font-medium text-foreground truncate" title={room.hotelBranchName}>
                        {room.hotelBranchName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Users className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{room.capacity} khách (Tối đa {room.maxAdults} NL, {room.maxChildren} TE)</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Bed className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="truncate max-w-37.5" title={room.bedInfo}>{room.bedInfo}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-foreground">
                        <Maximize className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{room.area} m²</span>
                      </div>
                      {room.utilities && room.utilities.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2 pt-2 border-t border-border">
                          {room.utilities.map((util) => {
                            const Icon = getUtilityIcon(util.iconName);
                            return (
                              <div key={util.id} className="p-1 bg-muted rounded-md border border-border text-muted-foreground" title={util.title}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-primary">
                      {room.price.toLocaleString("vi-VN")} ₫
                    </div>
                    {room.isVoucherApplicable && (
                      <div className="flex items-center gap-1 mt-1 text-[10px] font-medium text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded-sm w-fit border border-orange-200">
                        <Tag className="w-3 h-3" />
                        <span>Áp dụng Voucher</span>
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-2 items-start">
                      <button
                        onClick={() => onUpdateStatus(room)}
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border transition-colors hover:opacity-80 cursor-pointer ${statusColors[room.status] || "bg-muted text-muted-foreground border-border"
                          }`}
                        title="Cập nhật trạng thái phòng"
                      >
                        {statusLabels[room.status] || room.status}
                      </button>
                      {!room.isActive && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-destructive/10 text-destructive border border-destructive/20">
                          Ngừng hoạt động
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleVoucher(room)}
                        className={`${room.isVoucherApplicable
                          ? "text-orange-500 hover:bg-orange-50 hover:text-orange-600"
                          : "text-muted-foreground hover:text-primary hover:bg-primary/10"
                          }`}
                        title={room.isVoucherApplicable ? "Hủy áp dụng Voucher" : "Cho phép áp dụng Voucher"}
                      >
                        <Tag className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onToggleActive(room)}
                        className={`${room.isActive
                          ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                          : "text-green-500 hover:bg-green-50 hover:text-green-600"
                          }`}
                        title={room.isActive ? "Ngừng hoạt động" : "Kích hoạt"}
                      >
                        <Power className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(room)}
                        className="text-muted-foreground hover:text-orange-500 hover:bg-orange-50"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(room)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-4 bg-muted/50">
          <div>
            Hiển thị <span className="font-medium text-foreground">{rooms.length}</span> trên tổng số{" "}
            <span className="font-medium text-foreground">{totalElements}</span> phòng
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
