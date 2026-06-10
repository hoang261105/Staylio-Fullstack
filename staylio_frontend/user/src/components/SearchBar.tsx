import { MapPin, Calendar, Users, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "../../../common/components/ui/button";

interface SearchBarProps {
  compact?: boolean;
}

export function SearchBar({ compact = false }: SearchBarProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [keyword, setKeyword] = useState("");
  const [checkInDate, setCheckInDate] = useState("");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [adults, setAdults] = useState<number | "">("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (keyword) params.append("keyword", keyword);
    if (checkInDate) params.append("checkInDate", checkInDate);
    if (checkOutDate) params.append("checkOutDate", checkOutDate);
    if (adults) params.append("adults", adults.toString());

    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className={`w-full max-w-7xl mx-auto bg-card rounded-2xl shadow-2xl border border-border ${compact ? 'p-2' : 'p-4 md:p-6'}`}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-[1fr_1fr_1fr_1fr_auto]' : 'grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]'}`}>
        
        {/* Mục: Địa điểm */}
        <div className="flex items-center gap-3 px-4 py-3 bg-muted hover:bg-accent rounded-xl transition-all cursor-text group border border-transparent focus-within:border-primary focus-within:bg-background">
          <MapPin className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('components.searchBar.location')}</span>
            <input
              type="text"
              placeholder={t('components.searchBar.whereTo')}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Mục: Nhận phòng */}
        <div className="flex items-center gap-3 px-4 py-3 bg-muted hover:bg-accent rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-primary focus-within:bg-background">
          <Calendar className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('components.searchBar.checkIn')}</span>
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder={t('components.searchBar.addDate')}
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground cursor-pointer"
            />
          </div>
        </div>

        {/* Mục: Trả phòng */}
        <div className="flex items-center gap-3 px-4 py-3 bg-muted hover:bg-accent rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-primary focus-within:bg-background">
          <Calendar className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('components.searchBar.checkOut')}</span>
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder={t('components.searchBar.addDate')}
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground cursor-pointer"
            />
          </div>
        </div>

        {/* Mục: Số khách */}
        <div className="flex items-center gap-3 px-4 py-3 bg-muted hover:bg-accent rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-primary focus-within:bg-background">
          <Users className="w-5 h-5 text-primary shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{t('components.searchBar.guests')}</span>
            <input
              type="number"
              min="1"
              placeholder={t('components.searchBar.twoPeople')}
              value={adults}
              onChange={(e) => setAdults(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-foreground cursor-pointer"
            />
          </div>
        </div>
        
        {/* Nút tìm kiếm */}
        <Button
          onClick={handleSearch}
          className={`rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center shrink-0 
            ${compact ? 'w-12 h-12 self-center' : 'w-full py-6 lg:w-auto lg:px-8 h-full'}`}
        >
          <Search className="w-5 h-5" />
          {!compact && <span className="ml-2 font-semibold hidden lg:inline">{t('components.searchBar.searchBtn')}</span>}
        </Button>

      </div>
    </div>
  );
}