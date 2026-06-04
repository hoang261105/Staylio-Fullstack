import React from "react";
import { LocationCard } from "./LocationCard";
import type { FeaturedLocationResponse } from "../../../../common/interfaces/response/FeaturedLocationResponse";

interface LocationGridProps {
  locations: FeaturedLocationResponse[];
}

export const LocationGrid: React.FC<LocationGridProps> = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="py-12 text-center text-gray-500 dark:text-gray-400">
        Không có địa điểm nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {locations.map((location) => (
        <LocationCard key={location.provinceId} location={location} />
      ))}
    </div>
  );
};
