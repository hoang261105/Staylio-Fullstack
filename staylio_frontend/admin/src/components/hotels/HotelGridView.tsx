import { Eye, CheckCircle, Power, Image as ImageIcon } from "lucide-react";
import type { HotelResponse } from "../../../../common/interfaces/response/HotelResponse";
import { HotelStatus } from "../../../../common/enums/HotelStatus";
import { useState } from "react";
import { useHotelById } from "../../../../common/hooks/useHotels";
import HotelDetailModal from "./HotelDetailModal";

interface HotelGridViewProps {
  hotels: HotelResponse[];
}

export default function HotelGridView({ hotels }: HotelGridViewProps) {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedId, setSelectedId] = useState<number>(0);

  const { data: hotel } = useHotelById(selectedId);

  const handleViewDetail = (id: number) => {
    setSelectedId(id);
    setShowDetailModal(true);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels?.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow shadow-sm flex flex-col">
            <div className="relative h-48 bg-linear-to-br from-gray-200 to-gray-300">
              <div className="absolute inset-0 flex items-center justify-center">
                {hotel.imageUrl ? (
                  <img src={hotel.imageUrl} alt={hotel.name} className="w-full h-full object-cover" />
                ) : (
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                )}
              </div>
              <div className="absolute top-3 right-3 flex flex-col gap-2 items-end">
                <span
                  className={`px-2 py-1 text-white text-xs font-medium rounded shadow-sm ${hotel.status === HotelStatus.PENDING
                      ? "bg-yellow-500"
                      : hotel.status === HotelStatus.CONFIRMED
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                >
                  {hotel.status === HotelStatus.PENDING
                    ? "Chờ duyệt"
                    : hotel.status === HotelStatus.CONFIRMED
                      ? "Đã duyệt"
                      : "Từ chối"}
                </span>
                <span
                  className={`px-2 py-1 text-white text-xs font-medium rounded shadow-sm ${hotel.active === true
                      ? "bg-[#10B981]"
                      : "bg-red-500"
                    }`}
                >
                  {hotel.active === true ? "Đang hoạt động" : "Tạm đóng"}
                </span>
              </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="mb-2">
                <h3 className="font-semibold text-lg text-gray-900 truncate">{hotel.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <div className="text-xs text-gray-500">ID: {hotel.id}</div>
                  <div className="text-xs font-medium text-gray-700">{hotel.hostHotelName}</div>
                </div>
              </div>

              <p className="text-sm text-gray-600 mb-4 line-clamp-3 flex-1">
                {hotel.description}
              </p>

              <div className="flex items-center justify-end pt-4 border-t border-gray-100 gap-1.5">
                <button onClick={() => handleViewDetail(hotel.id)} className="p-2 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors" title="Xem chi tiết">
                  <Eye className="w-4 h-4" />
                </button>
                {hotel.status !== HotelStatus.CONFIRMED && (
                  <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Duyệt">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                )}
                <button className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors" title="Đổi trạng thái hoạt động">
                  <Power className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showDetailModal && hotel && (
        <HotelDetailModal hotel={hotel} onClose={() => setShowDetailModal(false)} />
      )}
    </>
  );
}