import { Star, Maximize, Users, BedDouble } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { RoomResponse } from "../../../common/interfaces/response/RoomResponse";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";
import { getUtilityIcon } from "../../../common/utils/iconUtils";
import { useTranslation } from "react-i18next";
import { Button } from "../../../common/components/ui/button";

interface RoomCardProps {
  room: RoomResponse;
  branchInfo?: HotelBranchResponse;
}

export default function RoomCard({ room, branchInfo }: RoomCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!room) return null;

  const primaryImage = room.images?.find(img => img.isPrimary)?.imageUrl
    || room.images?.[0]?.imageUrl
    || "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format&fit=crop";

  return (
    <div className="bg-card rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-border flex flex-col h-full group">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={primaryImage}
          alt={room.roomName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {room.isVoucherApplicable && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm z-10 uppercase tracking-wider">
            {t('components.roomCard.voucher')}
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-background/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-foreground">{room.averageRating?.toFixed(1) || "0.0"}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-card-foreground text-lg line-clamp-1 group-hover:text-primary transition-colors">
              {room.roomName}
            </h3>
            <p className="text-xs text-muted-foreground mt-1 uppercase font-medium tracking-wide">
              {room.roomType}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-3 mb-4">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Users className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">{t('components.roomCard.capacity', { adults: room.maxAdults, children: room.maxChildren })}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Maximize className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium">{room.area} m²</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <BedDouble className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium line-clamp-1 flex-1">{room.bedInfo}</span>
          </div>
        </div>

        <div className="flex flex-col gap-1.5 mb-5">
          {room.utilities?.slice(0, 3).map((utility) => {
            const Icon = getUtilityIcon(utility.iconName);
            return (
              <div key={utility.id} className="flex items-center gap-2 text-muted-foreground">
                <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Icon className="w-2.5 h-2.5 text-emerald-600" />
                </div>
                <span className="text-xs font-medium truncate">{utility.title}</span>
              </div>
            );
          })}
          {room.utilities?.length > 3 && (
            <div className="text-xs text-primary font-medium pl-6">
              {t('components.roomCard.otherUtilities', { count: room.utilities.length - 3 })}
            </div>
          )}
        </div>

        <div className="mt-auto pt-4 border-t border-border flex items-end justify-between">
          <div>
            <p className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider mb-0.5">{t('components.roomCard.pricePerNight')}</p>
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold text-card-foreground">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(room.price)}
              </span>
            </div>
          </div>

          <Button
            onClick={() => navigate(`/hotel/${branchInfo?.hotelId}/branch/${room.hotelBranchId}/room/${room.id}`)}
            className="rounded-xl px-5 py-5 shadow-md active:scale-95 transition-all"
          >
            {t('components.roomCard.detailsBtn')}
          </Button>
        </div>
      </div>
    </div>
  );
}
