/* eslint-disable @typescript-eslint/no-explicit-any */
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { NearbyPlace } from "../../../common/hooks/useNearbyPlaces";
import { renderToString } from "react-dom/server";
import { Utensils, Coffee, Landmark, Hospital, TreePine, Plane, MapPin, ShoppingBag, Grid3X3 } from "lucide-react";
import React from "react";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";
import { useTranslation } from "react-i18next";

const DefaultIcon = L.icon({
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

const getIconForType = (type: string, color: string, IconComponent: React.FC<any>) => {
  const iconHtml = renderToString(<IconComponent size={14} color="white" />);
  const markerHtmlStyles = `
    background-color: ${color};
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    left: -14px;
    top: -14px;
    position: relative;
    border-radius: 50%;
    border: 2px solid #FFFFFF;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  `;

  return L.divIcon({
    className: "custom-pin border-0 bg-transparent",
    iconAnchor: [0, 28],
    popupAnchor: [0, -36],
    html: `<span style="${markerHtmlStyles}">${iconHtml}</span>`
  });
};

const restaurantIcon = getIconForType("restaurant", "#f97316", Utensils); // orange
const cafeIcon = getIconForType("cafe", "#8b5cf6", Coffee); // purple
const attractionIcon = getIconForType("attraction", "#10b981", MapPin); // emerald
const museumIcon = getIconForType("museum", "#6366f1", Landmark); // indigo
const hospitalIcon = getIconForType("hospital", "#ef4444", Hospital); // red
const parkIcon = getIconForType("park", "#22c55e", TreePine); // green
const airportIcon = getIconForType("airport", "#0ea5e9", Plane); // sky
const mallIcon = getIconForType("mall", "#eab308", ShoppingBag); // yellow
const squareIcon = getIconForType("square", "#ec4899", Grid3X3); // pink

type BranchMapProps = {
  latitude: number;
  longitude: number;
  branchName: string;
  address: string;
  nearbyPlaces?: NearbyPlace[];
};

export default function BranchMap({
  latitude,
  longitude,
  branchName,
  address,
  nearbyPlaces = [],
}: BranchMapProps) {
  const { t } = useTranslation();

  return (
    <div className="h-112.5 w-full overflow-hidden rounded-2xl border border-border">
      <MapContainer
        center={[latitude, longitude]}
        zoom={15}
        scrollWheelZoom={false}
        className="h-full w-full z-0"
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[latitude, longitude]}>
          <Popup>
            <div>
              <strong className="text-primary">{branchName}</strong>
              <br />
              <span className="text-sm">{address}</span>
            </div>
          </Popup>
        </Marker>

        {nearbyPlaces.map((place) => {
          let icon = attractionIcon;
          if (place.type === "restaurant") icon = restaurantIcon;
          else if (place.type === "cafe") icon = cafeIcon;
          else if (place.type === "museum") icon = museumIcon;
          else if (place.type === "hospital") icon = hospitalIcon;
          else if (place.type === "park") icon = parkIcon;
          else if (place.type === "airport") icon = airportIcon;
          else if (place.type === "mall") icon = mallIcon;
          else if (place.type === "square") icon = squareIcon;

          const getTypeName = (type: string) => {
            switch (type) {
              case "restaurant": return t('components.nearbyPlaces.restaurant');
              case "cafe": return t('components.nearbyPlaces.cafe');
              case "museum": return t('components.nearbyPlaces.museum');
              case "hospital": return t('components.nearbyPlaces.hospital');
              case "park": return t('components.nearbyPlaces.park');
              case "airport": return t('components.nearbyPlaces.airport');
              case "mall": return t('components.nearbyPlaces.mall');
              case "square": return t('components.nearbyPlaces.square');
              default: return t('components.nearbyPlaces.default');
            }
          };

          return (
            <Marker key={place.id} position={[place.lat, place.lon]} icon={icon}>
              <Popup>
                <div>
                  <strong className="text-foreground">{place.name}</strong>
                  <br />
                  <span className="text-xs text-muted-foreground capitalize">{getTypeName(place.type)}</span>
                  <br />
                  <span className="text-xs font-semibold text-primary">
                    {t('components.nearbyPlaces.distanceAway', { 
                      distance: place.distance < 1000 ? `${place.distance}m` : `${(place.distance / 1000).toFixed(1)}km` 
                    })}
                  </span>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}