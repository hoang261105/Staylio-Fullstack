import React from "react";
import { LocationCard } from "./LocationCard";
import type { FeaturedLocationResponse } from "../../../../common/interfaces/response/FeaturedLocationResponse";

interface LocationGridProps {
  locations: FeaturedLocationResponse[];
  layout?: "horizontal" | "grid";
}

export const LocationGrid: React.FC<LocationGridProps> = ({ locations, layout = "horizontal" }) => {
  if (!locations || locations.length === 0) {
    return (
      <div className="py-12 text-center text-muted-foreground">
        Không có địa điểm nào để hiển thị.
      </div>
    );
  }

  if (layout === "grid") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-4">
        {locations.map((location) => (
          <div key={location.provinceId}>
            <LocationCard location={location} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {locations.map((location) => (
        <div key={location.provinceId} className="w-[80vw] sm:w-75 shrink-0 snap-start">
          <LocationCard location={location} />
        </div>
      ))}
    </div>
  );
};
