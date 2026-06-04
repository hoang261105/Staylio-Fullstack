import { useState } from "react";
import { Coffee, MapPin, Utensils, Navigation, Landmark, Plane, TreePine, Hospital } from "lucide-react";
import type { NearbyPlace } from "../../../common/hooks/useNearbyPlaces";

interface NearbyPlacesListProps {
  places: NearbyPlace[];
  isLoading: boolean;
}

export default function NearbyPlacesList({ places, isLoading }: NearbyPlacesListProps) {
  if (isLoading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        <div className="h-20 bg-gray-100 rounded-xl"></div>
        <div className="h-20 bg-gray-100 rounded-xl"></div>
      </div>
    );
  }

  if (!places || places.length === 0) {
    return (
      <div className="text-gray-500 italic text-sm">
        Chưa tìm thấy địa điểm nổi bật nào xung quanh khu vực này.
      </div>
    );
  }

  const [showAll, setShowAll] = useState(false);

  const visiblePlaces = showAll ? places : places.slice(0, 6);

  const getIcon = (type: string) => {
    switch (type) {
      case "restaurant":
        return <Utensils className="w-5 h-5 text-orange-500" />;
      case "cafe":
        return <Coffee className="w-5 h-5 text-purple-500" />;
      case "museum":
        return <Landmark className="w-5 h-5 text-indigo-500" />;
      case "hospital":
        return <Hospital className="w-5 h-5 text-red-500" />;
      case "park":
        return <TreePine className="w-5 h-5 text-green-500" />;
      case "airport":
        return <Plane className="w-5 h-5 text-sky-500" />;
      default:
        return <MapPin className="w-5 h-5 text-emerald-500" />;
    }
  };

  const getTypeName = (type: string) => {
    switch (type) {
      case "restaurant":
        return "Nhà hàng";
      case "cafe":
        return "Quán Cafe";
      case "museum":
        return "Bảo tàng";
      case "hospital":
        return "Bệnh viện";
      case "park":
        return "Công viên";
      case "airport":
        return "Sân bay";
      default:
        return "Điểm tham quan";
    }
  };

  return (
    <div className="mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {visiblePlaces.map((place) => (
          <div key={place.id} title={place.name} className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="p-2 bg-gray-50 rounded-lg shrink-0">
                {getIcon(place.type)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-900 text-sm md:text-base truncate">{place.name}</h4>
                <p className="text-xs text-gray-500">{getTypeName(place.type)}</p>
              </div>
            </div>
            <div className="flex items-center gap-1 text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full whitespace-nowrap shrink-0 ml-3">
              <Navigation className="w-3.5 h-3.5" />
              <span className="text-xs font-bold">
                {place.distance < 1000 ? `${place.distance} m` : `${(place.distance / 1000).toFixed(1)} km`}
              </span>
            </div>
          </div>
        ))}
      </div>

      {places.length > 6 && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowAll(!showAll)}
            className="px-6 py-2 border border-blue-600 text-blue-600 font-medium text-sm rounded-full hover:bg-blue-50 transition-colors"
          >
            {showAll ? "Thu gọn" : `Xem tất cả ${places.length} địa điểm`}
          </button>
        </div>
      )}

      <p className="mt-6 text-xs text-gray-500 italic text-center">
        * Khoảng cách hiển thị dựa trên đường chim bay. Khoảng cách di chuyển thực tế có thể khác.
      </p>
    </div>
  );
}
