import { useNavigate } from "react-router-dom";
import type { HotelBranchResponse } from "../../../../common/interfaces/response/HotelBranchResponse";
import { Star, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/components/ui/button";

interface BranchCardProps {
  branch: HotelBranchResponse;
}

export default function BranchCard({ branch }: BranchCardProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div
      onClick={() => navigate(`/hotel/${branch.hotelId}/branch/${branch.id}`)}
      className="group bg-card rounded-2xl border border-border overflow-hidden cursor-pointer hover:shadow-xl hover:border-primary/50 hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative h-48 sm:h-56 overflow-hidden">
        <img
          src={
            branch.imageUrl ||
            "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          }
          alt={branch.hotelBranchName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-60"></div>
        
        {/* Rating Badge */}
        <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm">
          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          <span className="text-sm font-bold text-foreground">{branch.averageRating > 0 ? branch.averageRating.toFixed(1) : t('locationBranches.notRatedYet')}</span>
          {branch.countReview > 0 && (
            <span className="text-xs text-muted-foreground font-medium">({branch.countReview})</span>
          )}
        </div>

        {/* Brand Tag */}
        <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
          <span className="text-xs font-medium text-white tracking-wide">{branch.hotelName}</span>
        </div>
      </div>

      <div className="p-5 flex flex-col grow">
        <h3 className="text-lg font-bold text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
          {branch.hotelBranchName}
        </h3>
        
        <div className="flex items-start gap-1.5 mt-2 text-muted-foreground">
          <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-muted-foreground" />
          <p className="text-sm line-clamp-2 leading-relaxed">
            {branch.address}, {branch.wardName}, {branch.provinceName}
          </p>
        </div>

        <div className="mt-auto pt-4 flex items-center justify-between border-t border-border">
          <div className="text-sm text-muted-foreground flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {t('locationBranches.capacity', { count: branch.capacity })}
          </div>
          <Button variant="outline" size="sm" className="group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors">
            {t('locationBranches.details')}
          </Button>
        </div>
      </div>
    </div>
  );
}
