import React from "react";
import { LocationCard } from "./LocationCard";
import type { FeaturedLocationResponse } from "../../../../common/interfaces/response/FeaturedLocationResponse";

interface LocationGridProps {
  locations: FeaturedLocationResponse[];
}

export const LocationGrid: React.FC<LocationGridProps> = ({ locations }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Không có địa điểm nào để hiển thị.
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {locations.map((location) => (
        <div key={location.provinceId} className="w-[80vw] sm:w-[300px] shrink-0 snap-start">
          <LocationCard location={location} />
        </div>
      ))}
    </div>
  );
};
