/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from "@tanstack/react-query";

export interface NearbyPlace {
  id: number;
  lat: number;
  lon: number;
  name: string;
  type: "restaurant" | "cafe" | "attraction" | "museum" | "hospital" | "school" | "park" | "airport" | "mall" | "square";
  distance: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const phi1 = lat1 * Math.PI / 180;
  const phi2 = lat2 * Math.PI / 180;
  const deltaPhi = (lat2 - lat1) * Math.PI / 180;
  const deltaLambda = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) *
    Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

export const useNearbyPlaces = (lat: number | null, lon: number | null) => {
  return useQuery({
    queryKey: ["nearbyPlaces", lat, lon],
    queryFn: async (): Promise<NearbyPlace[]> => {
      if (!lat || !lon) return [];

      const query = `
        [out:json];
        (
          nwr["amenity"="restaurant"](around:3000,${lat},${lon});
          nwr["amenity"="cafe"](around:3000,${lat},${lon});
          nwr["tourism"="attraction"](around:3000,${lat},${lon});
          nwr["tourism"="museum"](around:3000,${lat},${lon});
          nwr["amenity"="hospital"](around:3000,${lat},${lon});
          nwr["amenity"="clinic"](around:3000,${lat},${lon});
          nwr["amenity"="doctors"](around:3000,${lat},${lon});
          nwr["healthcare"="hospital"](around:3000,${lat},${lon});
          nwr["healthcare"="clinic"](around:3000,${lat},${lon});
          nwr["amenity"="school"](around:3000,${lat},${lon});
          nwr["leisure"="park"](around:3000,${lat},${lon});
          nwr["aeroway"="aerodrome"](around:10000,${lat},${lon});
          nwr["shop"="mall"](around:3000,${lat},${lon});
          nwr["place"="square"](around:3000,${lat},${lon});
          nwr["historic"](around:3000,${lat},${lon});
        );
        out center;
      `;

      const res = await fetch("https://overpass-api.de/api/interpreter", {
        method: "POST",
        body: query,
      });

      const data = await res.json();

      const places: NearbyPlace[] = data.elements
        .filter((el: any) => el.tags && (el.tags.name || el.tags.amenity === "hospital" || el.tags.amenity === "clinic" || el.tags.amenity === "doctors" || el.tags.healthcare) && (el.lat || el.center?.lat) && (el.lon || el.center?.lon))
        .map((el: any) => {
          let type: NearbyPlace["type"] = "attraction";
          const tags = el.tags;

          if (tags.amenity === "restaurant") type = "restaurant";
          else if (tags.amenity === "cafe") type = "cafe";
          else if (tags.amenity === "hospital" || tags.amenity === "clinic" || tags.amenity === "doctors" || tags.healthcare) type = "hospital";
          else if (tags.amenity === "school") type = "school";
          else if (tags.tourism === "museum") type = "museum";
          else if (tags.leisure === "park") type = "park";
          else if (tags.aeroway === "aerodrome") type = "airport";
          else if (tags.shop === "mall") type = "mall";
          else if (tags.place === "square") type = "square";

          const placeLat = el.lat || el.center?.lat;
          const placeLon = el.lon || el.center?.lon;

          return {
            id: el.id,
            lat: placeLat,
            lon: placeLon,
            name: el.tags.name || "Cơ sở y tế",
            type,
            distance: calculateDistance(lat, lon, placeLat, placeLon),
          };
        });

      return places.sort((a, b) => a.distance - b.distance);
    },
    enabled: !!lat && !!lon,
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};
