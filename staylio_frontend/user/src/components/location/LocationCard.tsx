import { MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { FeaturedLocationResponse } from "../../../../common/interfaces/response/FeaturedLocationResponse";

interface LocationCardProps {
  location: FeaturedLocationResponse;
  onClick?: () => void;
}

export const LocationCard: React.FC<LocationCardProps> = ({ location, onClick }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      navigate(`/location/${location.provinceId}`);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
    >
      <img
        src={
          location.imageUrl ||
          "https://images.unsplash.com/photo-1596422846543-75c6ef08b739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"
        }
        alt={location.provinceName}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
      <div className="absolute bottom-0 left-0   right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-400" />
          {location.provinceName}
        </h3>
        <div className="flex flex-wrap items-center gap-2">
          <span className="bg-white dark:bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-white">
            {location.totalHotels} thương hiệu
          </span>
          <span className="bg-white dark:bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-900 dark:text-white">
            {location.totalBranches} chi nhánh
          </span>
        </div>
      </div>
    </div>
  );
};
