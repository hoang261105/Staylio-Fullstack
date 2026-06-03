import { Eye, CheckCircle, Power, Image as ImageIcon, Unlock, Lock, Loader2 } from "lucide-react";
import type { HotelResponse } from "../../../../common/interfaces/response/HotelResponse";
import { HotelStatus } from "../../../../common/enums/HotelStatus";
import { useState } from "react";
import {
  useHotelActiveStatusMutation,
  useHotelById,
  useHotelStatusMutation,
  useSingleHotelActiveStatusMutation
} from "../../../../common/hooks/useHotels";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "../../../../common/components/ui/alert-dialog";
import HotelDetailModal from "./HotelDetailModal";

interface HotelListViewProps {
  hotels: HotelResponse[];
  direction: "asc" | "desc";
  onSort: (field: string) => void;
}

export default function HotelListView({ hotels }: HotelListViewProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    hotelId: number | null;
    currentStatus: HotelStatus | null;
  }>({
    open: false,
    hotelId: null,
    currentStatus: null,
  });

  const [activeConfirmModal, setActiveConfirmModal] = useState<{
    open: boolean;
    hotelId: number | null;
    currentActive: boolean | null;
  }>({
    open: false,
    hotelId: null,
    currentActive: null,
  });

  const { data: hotel } = useHotelById(selectedId);
  const { mutate: updateHotelStatus } = useHotelStatusMutation();
  const { mutate: updateHotelActiveStatus } = useHotelActiveStatusMutation();
  const { mutate: toggleSingleActiveStatus, isPending: isTogglingActive } = useSingleHotelActiveStatusMutation();

  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setShowDetailModal(true);
  };

  const handleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === hotels.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(hotels.map((h) => h.id));
    }
  };

  const handleToggleActiveStatus = (ids: number[], currentActive: boolean) => {
    if (selectedIds.length === 0) return;
    updateHotelActiveStatus({
      ids,
      active: currentActive,
    });

    setSelectedIds([]);
  }

  const handleToggleStatus = (id: number, currentStatus: HotelStatus) => {
    setConfirmModal({
      open: true,
      hotelId: id,
      currentStatus,
    });
  };

  const handleToggleSingleActiveClick = (id: number, currentActive: boolean) => {
    setActiveConfirmModal({
      open: true,
      hotelId: id,
      currentActive,
    });
  };

  const handleConfirmToggleActive = () => {
    if (activeConfirmModal.hotelId !== null) {
      toggleSingleActiveStatus(activeConfirmModal.hotelId, {
        onSettled: () => {
          setActiveConfirmModal({ open: false, hotelId: null, currentActive: null });
        }
      });
    }
  };

  const handleConfirm = () => {
    if (confirmModal.hotelId && confirmModal.currentStatus) {
      updateHotelStatus({
        id: confirmModal.hotelId,
        status: HotelStatus.CONFIRMED,
      });
      setConfirmModal({
        open: false,
        hotelId: null,
        currentStatus: null,
      });
    }
  };

  const handleReject = () => {
    if (confirmModal.hotelId && confirmModal.currentStatus) {
      updateHotelStatus({
        id: confirmModal.hotelId,
        status: HotelStatus.REJECTED,
      });
      setConfirmModal({
        open: false,
        hotelId: null,
        currentStatus: null,
      });
    }
  }
  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {selectedIds.length > 0 && (
            <div className="flex items-center justify-between mb-4 px-4 py-3 bg-blue-50 border border-blue-100 rounded-lg">
              <span className="text-sm text-gray-700 font-medium">
                Đã chọn{" "}
                <span className="text-blue-600">{selectedIds.length}</span>{" "}
                khách sạn
              </span>

              <div className="flex gap-2">
                <button
                  onClick={() => handleToggleActiveStatus(selectedIds, false)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-all"
                >
                  <Lock size={14} />
                  Đóng
                </button>

                <button
                  onClick={() => handleToggleActiveStatus(selectedIds, true)}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-all"
                >
                  <Unlock size={14} />
                  Mở lại
                </button>
              </div>
            </div>
          )}

          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
              <tr>
                <th className="px-6 py-4">
                  <input
                    type="checkbox"
                    checked={hotels.length > 0 && selectedIds.length === hotels.length}
                    onChange={handleSelectAll}
                    className="w-4 h-4 rounded border-gray-300 text-[#0066FF] focus:ring-[#0066FF]"
                  />
                </th>
                <th className="px-6 py-4 font-medium">Khách sạn</th>
                <th className="px-6 py-4 font-medium">Mô tả</th>
                <th className="px-6 py-4 font-medium">Chủ thương hiệu</th>
                <th className="px-6 py-4 font-medium">Trạng thái phê duyệt</th>
                <th className="px-6 py-4 font-medium">Trạng thái hoạt động</th>
                <th className="px-6 py-4 font-medium text-center">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
              {hotels?.map((hotel: HotelResponse) => (
                <tr
                  className="hover:bg-gray-50 transition-colors"
                  key={hotel.id}
                >
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(hotel.id)}
                      onChange={() => handleSelect(hotel.id)}
                      className="w-4 h-4 rounded border-gray-300 text-[#0066FF]"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-linear-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center shrink-0">
                        {hotel.imageUrl ? (
                          <img
                            src={hotel.imageUrl}
                            alt={hotel.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-12 h-12 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {hotel.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {hotel.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="truncate max-w-50 text-gray-600">
                      {hotel.description}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-gray-900">
                      {hotel.hostHotelName}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        hotel.status === HotelStatus.PENDING
                          ? "bg-yellow-100 text-yellow-800"
                          : hotel.status === HotelStatus.CONFIRMED
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {hotel.status === HotelStatus.PENDING
                        ? "Chờ duyệt"
                        : hotel.status === HotelStatus.CONFIRMED
                          ? "Đã duyệt"
                          : "Từ chối"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        hotel.active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {hotel.active ? "Đang hoạt động" : "Tạm đóng"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => handleViewDetail(hotel.id)}
                        className="p-2 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {hotel.status !== HotelStatus.CONFIRMED &&
                        hotel.status !== HotelStatus.REJECTED && (
                          <button
                            onClick={() =>
                              handleToggleStatus(hotel.id, hotel.status)
                            }
                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Duyệt"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        )}
                      <button
                        onClick={() => handleToggleSingleActiveClick(hotel.id, hotel.active)}
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title={hotel.active ? "Dừng hoạt động" : "Kích hoạt lại"}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showDetailModal && hotel && (
            <HotelDetailModal
              hotel={hotel}
              onClose={() => setShowDetailModal(false)}
            />
          )}
        </div>
      </div>

      <AlertDialog 
        open={confirmModal.open} 
        onOpenChange={(open) => !open && setConfirmModal({ open: false, hotelId: null, currentStatus: null })}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn duyệt / từ chối khách sạn này không? Hành động
              này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <div className="flex gap-2 w-full sm:w-auto mt-2 sm:mt-0">
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  handleReject();
                }}
                className="bg-red-600 hover:bg-red-700 w-full sm:w-auto"
              >
                Từ chối
              </AlertDialogAction>
              <AlertDialogAction 
                onClick={(e) => {
                  e.preventDefault();
                  handleConfirm();
                }}
                className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
              >
                Xác nhận
              </AlertDialogAction>
            </div>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={activeConfirmModal.open} onOpenChange={(open) => !open && setActiveConfirmModal({ open: false, hotelId: null, currentActive: null })}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận</AlertDialogTitle>
            <AlertDialogDescription>
              {activeConfirmModal.currentActive
                ? "Khi dừng hoạt động thương hiệu này, toàn bộ chi nhánh và phòng thuộc thương hiệu cũng sẽ bị ẩn khỏi hệ thống tìm kiếm. Các booking cũ vẫn được giữ nguyên."
                : "Kích hoạt lại thương hiệu này sẽ hiển thị lại các chi nhánh và phòng thuộc thương hiệu."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isTogglingActive}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleConfirmToggleActive();
              }}
              disabled={isTogglingActive}
            >
              {isTogglingActive && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {activeConfirmModal.currentActive ? "Xác nhận dừng hoạt động" : "Xác nhận kích hoạt lại"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
