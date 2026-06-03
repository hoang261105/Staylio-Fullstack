import { ArrowRight, MapPin } from "lucide-react";
import { useFeaturedProvinces } from "../../../common/hooks/useProvinces";
import type { FeaturedLocationResponse } from "../../../common/interfaces/response/FeaturedLocationResponse";

export const FeaturedLocations = () => {
  const { data: featuredLocations } = useFeaturedProvinces();

  if (!featuredLocations || featuredLocations.length === 0) return null;

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Địa điểm nổi bật</h2>
            <p className="text-lg text-gray-600">
              Khám phá những điểm đến được du khách yêu thích nhất
            </p>
          </div>
          <button className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2 transition-colors group">
            Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLocations.map((location: FeaturedLocationResponse) => (
            <div
              key={location.provinceId}
              className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
            >
              <img
                src={location.imageUrl || "https://images.unsplash.com/photo-1596422846543-75c6ef08b739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"}
                alt={location.provinceName}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-400" />
                  {location.provinceName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-white/90">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {location.totalHotels} khách sạn
                  </span>
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {location.totalBranches} chi nhánh
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
