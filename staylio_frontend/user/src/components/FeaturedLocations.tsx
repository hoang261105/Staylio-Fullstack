import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useFeaturedProvinces } from "../../../common/hooks/useProvinces";
import { LocationGrid } from "./location/LocationGrid";

export const FeaturedLocations = () => {
  const { data: featuredLocations } = useFeaturedProvinces();

  if (!featuredLocations || featuredLocations.length === 0) return null;

  return (
    <section className="py-24 bg-white dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">Địa điểm nổi bật</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Khám phá những điểm đến được du khách yêu thích nhất
            </p>
          </div>
          <Link to="/locations" className="text-blue-600 font-semibold hover:text-blue-800 flex items-center gap-2 transition-colors group">
            Xem tất cả <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <LocationGrid locations={featuredLocations} />
      </div>
    </section>
  );
};
