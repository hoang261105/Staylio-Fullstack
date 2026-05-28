import { Star, MapPin, Users, Building, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RoomSearchResponse } from "../../../common/interfaces/response/RoomSearchResponse";

interface RoomSearchCardProps {
  room: RoomSearchResponse;
}

export function RoomSearchCard({ room }: RoomSearchCardProps) {
  const navigate = useNavigate();
  if (!room) return null;

  const primaryImage = room.images && room.images.length > 0
    ? room.images[0]
    : "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 grid grid-cols-1 md:grid-cols-12 group">
      <div className="relative w-full h-56 md:h-full overflow-hidden md:col-span-5">
        <img
          src={primaryImage}
          alt={room.roomName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm z-10 uppercase tracking-wider">
          {room.roomType}
        </div>
      </div>

      <div className="p-5 flex flex-col md:col-span-7 justify-between">
        <div className="flex justify-between items-start mb-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-900 text-xl line-clamp-1 group-hover:text-blue-600 transition-colors">
              {room.roomName}
            </h3>
            <div className="flex items-center gap-1.5 text-blue-700 font-semibold text-sm mt-1 mb-2 bg-blue-50 w-fit px-2.5 py-1 rounded-lg">
              <Building className="w-3.5 h-3.5" />
              <span className="line-clamp-1">{room.hotelName} - {room.hotelBranchName}</span>
            </div>
          </div>

          <div className="flex flex-col items-end shrink-0">
            <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-bold">{room.averageRating?.toFixed(1) || "0.0"}</span>
            </div>
            <span className="text-xs text-gray-500 font-medium mt-1">
              ({room.countReview || 0} đánh giá)
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-gray-500 mb-4">
          <MapPin className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium line-clamp-1">{room.address}, {room.provinceName}</span>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Users className="w-4 h-4 text-emerald-500" />
            <span className="text-sm font-medium">Sức chứa: {room.capacity} (Max: {room.maxAdults}L, {room.maxChildren}TE)</span>
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-1">Giá từ</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-blue-600">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
              </span>
              <span className="text-sm text-gray-500 font-medium">/đêm</span>
            </div>
          </div>

          <button 
            onClick={() => navigate(`/hotel/${room.hotelId}/branch/${room.hotelBranchId}/room/${room.roomId}`)}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-6 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2"
          >
            Chi tiết phòng <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
