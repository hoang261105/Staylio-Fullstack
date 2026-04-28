import { Star, MapPin } from "lucide-react";
import type { Hotel } from "../apis/hotel";

interface HotelCardProps {
  hotel: Hotel;
}

export function HotelCard({ hotel }: HotelCardProps) {
  if (!hotel) return null;

  return (
    <div
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer group border border-gray-100 flex flex-col h-full"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {hotel.featured && (
          <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[12px] font-bold px-3 py-1 rounded-full shadow-sm z-10">
            Đề xuất
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-800">{hotel.rating}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <div className="mb-2">
          <h3 className="font-bold text-gray-800 text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
            {hotel.name}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5" />
            <span className="text-xs">{hotel.location}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-3.5 h-3.5 ${i < hotel.stars ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200'}`} 
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 font-medium">
            ({hotel.reviews?.toLocaleString()} đánh giá)
          </span>
        </div>

        {/* Amenities */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {hotel.amenities?.slice(0, 3).map((amenity, idx) => (
            <span
              key={idx}
              className="text-[11px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md"
            >
              {amenity}
            </span>
          ))}
          {hotel.amenities?.length > 3 && (
            <span className="text-[11px] text-gray-400 pt-0.5">
              +{hotel.amenities.length - 3}
            </span>
          )}
        </div>

        {/* Price & Action - Đẩy xuống cuối card */}
        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-gray-400 font-medium uppercase tracking-wider">Giá từ</p>
            <div className="flex items-baseline gap-0.5">
              <span className="text-xl font-bold text-blue-600">
                ${hotel.price}
              </span>
              <span className="text-xs text-gray-500">/đêm</span>
            </div>
          </div>
          
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-md shadow-blue-100 active:scale-95">
            Chi tiết
          </button>
        </div>
      </div>
    </div>
  );
}