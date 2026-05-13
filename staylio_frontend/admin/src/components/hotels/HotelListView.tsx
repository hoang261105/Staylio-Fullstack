import { Eye, CheckCircle, Power, Image as ImageIcon, Unlock, Lock } from "lucide-react";
import type { HotelResponse } from "../../../../common/interfaces/response/HotelResponse";
import { HotelStatus } from "../../../../common/enums/HotelStatus";
import { useState } from "react";
import {
  useHotelActiveStatusMutation,
  useHotelById,
  useHotelStatusMutation,
} from "../../../../common/hooks/useHotels";
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

  const { data: hotel } = useHotelById(selectedId);
  const { mutate: updateHotelStatus } = useHotelStatusMutation();
  const { mutate: updateHotelActiveStatus } = useHotelActiveStatusMutation();

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
                        className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Đổi trạng thái hoạt động"
                      >
                        <Power className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showDetailModal && (
            <HotelDetailModal
              hotel={hotel}
              onClose={() => setShowDetailModal(false)}
            />
          )}
        </div>
      </div>

      {confirmModal.open && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Xác nhận
            </h3>

            <p className="text-sm text-gray-600 mb-6">
              Bạn có chắc chắn duyệt / từ chối khách sạn này không? Hành động
              này không thể hoàn tác.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setConfirmModal({
                    open: false,
                    hotelId: null,
                    currentStatus: null,
                  })
                }
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Hủy
              </button>

              <button
                onClick={handleReject}
                className="bg-red-600 hover:bg-red-700 px-4 py-2 text-sm text-white rounded-lg "
              >
                Từ chối
              </button>

              <button
                onClick={handleConfirm}
                className="bg-green-600 hover:bg-green-700 px-4 py-2 text-sm text-white rounded-lg "
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
