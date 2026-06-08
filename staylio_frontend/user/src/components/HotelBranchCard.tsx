import { Star, MapPin, Users, Phone } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useChatContext } from "../../../common/contexts/ChatContext";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";
import { useTranslation } from "react-i18next";

interface HotelBranchCardProps {
  branch: HotelBranchResponse;
}

export function HotelBranchCard({ branch }: HotelBranchCardProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { openManagerChat } = useChatContext();

  if (!branch) return null;

  return (
    <div
      onClick={() => navigate(`/hotel/${branch.hotelId}/branch/${branch.id}`)}
      className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group border border-gray-100 dark:border-gray-700 flex flex-col h-full"
    >
      <div className="relative h-52 w-full overflow-hidden">
        <img
          src={branch.imageUrl || "https://images.unsplash.com/photo-1566073771259-6a8506099945?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600"}
          alt={branch.hotelBranchName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[12px] font-bold px-3 py-1 rounded-full z-10">
          {t('components.hotelBranchCard.featured')}
        </div>
        <div className="absolute bottom-3 right-3 bg-white dark:bg-gray-800/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
          <span className="text-xs font-bold text-gray-800 dark:text-gray-100">{branch.averageRating?.toFixed(1) || "0.0"}</span>
        </div>
      </div>

      <div className="p-4 flex flex-col grow">
        <div className="mb-2">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {branch.hotelBranchName}
          </h3>
          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 dark:text-gray-500 mt-1">
            <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="text-xs line-clamp-1">{branch.address}, {branch.wardName}, {branch.provinceName}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${i < Math.round(branch.averageRating || 0) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-200 dark:text-gray-600 dark:text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
            ({branch.countReview?.toLocaleString() || 0} {t('components.hotelBranchCard.reviews')})
          </span>
        </div>

        <div className="mb-4">
          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1.5 rounded-lg border border-b dark:border-gray-700lue-100 dark:border-b dark:border-gray-700lue-800/50 line-clamp-1">
            {t('components.hotelBranchCard.system')}: {branch.hotelName}
          </span>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-500 mb-1">
              <Users className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{t('components.hotelBranchCard.capacity')}: {branch.capacity}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-300 dark:text-gray-400 dark:text-gray-500">
              <Phone className="w-3.5 h-3.5" />
              <span className="text-[11px] font-medium">{branch.phone}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                openManagerChat(branch.id, branch.hotelBranchName);
              }}
              className="bg-emerald-100 hover:bg-emerald-200 text-emerald-700 dark:bg-emerald-900/40 dark:hover:bg-emerald-900/60 dark:text-emerald-300 text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95 border border-emerald-200 dark:border-emerald-800"
            >
              {t('components.hotelBranchCard.contact')}
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all active:scale-95">
              {t('components.hotelBranchCard.details')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
