import { Star, Maximize, Users, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RoomResponse } from "../../../common/interfaces/response/RoomResponse";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";
import { getUtilityIcon } from "../../../common/utils/iconUtils";

interface RoomCardProps {
  room: RoomResponse;
  branchInfo?: HotelBranchResponse;
}

export default function RoomCard({ room, branchInfo }: RoomCardProps) {
  const navigate = useNavigate();
  if (!room) return null;

  const primaryImage = room.images?.find(img => img.isPrimary)?.imageUrl
    || room.images?.[0]?.imageUrl
    || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 flex flex-col h-full group">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={primaryImage}
          alt={room.roomName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {room.isVoucherApplicable && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10 uppercase tracking-wider">
            Có ưu đãi
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{room.averageRating?.toFixed(1) || "0.0"}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
              {room.roomName}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1 uppercase font-medium tracking-wide">
              {room.roomType}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 mb-4">
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium">{room.maxAdults} Lớn, {room.maxChildren} Trẻ em</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <Maximize className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium">{room.area} m²</span>
          </div>
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-300">
            <BedDouble className="w-4 h-4 text-blue-500" />
            <span className="text-xs font-medium line-clamp-1 flex-1">{room.bedInfo}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          {room.utilities?.slice(0, 3).map((utility) => {
            const Icon = getUtilityIcon(utility.iconName);
            return (
              <div key={utility.id} className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium truncate">{utility.title}</span>
              </div>
            );
          })}
          {room.utilities?.length > 3 && (
            <div className="text-xs text-blue-600 font-medium pl-6">
              +{room.utilities.length - 3} tiện ích khác
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-end justify-between">
          <div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold uppercase tracking-wider mb-0.5">Giá mỗi đêm</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
              </span>
            </div>
          </div>

          <button
            onClick={() => navigate(`/hotel/${branchInfo?.hotelId}/branch/${room.hotelBranchId}/room/${room.id}`)}
            className="bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all shadow-md active:scale-95"
          >
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}
