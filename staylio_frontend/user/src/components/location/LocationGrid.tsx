import React, { useRef } from "react";
import { LocationCard } from "./LocationCard";
import type { FeaturedLocationResponse } from "../../../../common/interfaces/response/FeaturedLocationResponse";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../../../common/components/ui/button";

interface LocationGridProps {
  locations: FeaturedLocationResponse[];
  layout?: "horizontal" | "grid";
}

export const LocationGrid: React.FC<LocationGridProps> = ({ locations, layout = "horizontal" }) => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

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
    <div className="relative group">
      <div 
        ref={scrollContainerRef}
        className="flex overflow-x-auto snap-x snap-mandatory gap-6 pb-4 scrollbar-hide scroll-smooth" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {locations.map((location) => (
          <div key={location.provinceId} className="w-[80vw] sm:w-75 shrink-0 snap-start">
            <LocationCard location={location} />
          </div>
        ))}
      </div>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -left-4 -translate-y-1/2 w-10 h-10 rounded-full shadow-md bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex border-border"
        onClick={scrollLeft}
      >
        <ChevronLeft className="w-5 h-5 text-foreground" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute top-1/2 -right-4 -translate-y-1/2 w-10 h-10 rounded-full shadow-md bg-background/80 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex border-border"
        onClick={scrollRight}
      >
        <ChevronRight className="w-5 h-5 text-foreground" />
      </Button>
    </div>
  );
};
