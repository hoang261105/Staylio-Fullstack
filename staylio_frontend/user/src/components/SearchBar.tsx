import { MapPin, Calendar, Users, Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SearchBarProps {
  compact?: boolean;
}

export function SearchBar({ compact = false }: SearchBarProps) {
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
    <div className={`w-full max-w-7xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 ${compact ? 'p-2' : 'p-4 md:p-6'}`}>
      <div className={`grid gap-3 ${compact ? 'grid-cols-[1fr_1fr_1fr_1fr_auto]' : 'grid-cols-1 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]'}`}>
        
        {/* Mục: Địa điểm */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-xl transition-all cursor-text group border border-transparent focus-within:border-blue-400 focus-within:bg-white dark:bg-gray-800">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Địa điểm</span>
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 dark:text-gray-200 placeholder:text-gray-400 dark:text-gray-500"
            />
          </div>
        </div>

        {/* Mục: Nhận phòng */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-blue-400 focus-within:bg-white dark:bg-gray-800">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Nhận phòng</span>
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="Thêm ngày"
              value={checkInDate}
              onChange={(e) => setCheckInDate(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Mục: Trả phòng */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-blue-400 focus-within:bg-white dark:bg-gray-800">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Trả phòng</span>
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="Thêm ngày"
              value={checkOutDate}
              onChange={(e) => setCheckOutDate(e.target.value)}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
            />
          </div>
        </div>

        {/* Mục: Số khách */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:bg-gray-700 rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-blue-400 focus-within:bg-white dark:bg-gray-800">
          <Users className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Khách</span>
            <input
              type="number"
              min="1"
              placeholder="2 người"
              value={adults}
              onChange={(e) => setAdults(e.target.value ? Number(e.target.value) : "")}
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 dark:text-gray-200 cursor-pointer"
            />
          </div>
        </div>
        
        {/* Nút tìm kiếm */}
        <button
          onClick={handleSearch}
          className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center shrink-0 
            ${compact ? 'w-12 h-12 self-center' : 'w-full py-4 lg:w-auto lg:px-8 h-full'}`}
        >
          <Search className="w-5 h-5" />
          {!compact && <span className="ml-2 font-semibold hidden lg:inline">Tìm kiếm</span>}
        </button>

      </div>
    </div>
  );
}