import { MapPin, Calendar, Users, Search } from "lucide-react";

interface SearchBarProps {
  compact?: boolean;
}

export function SearchBar({ compact = false }: SearchBarProps) {
  return (
    <div className={`w-full max-w-7xl mx-auto bg-white rounded-2xl shadow-2xl border border-gray-100 ${compact ? 'p-2' : 'p-4 md:p-6'}`}>
      <div className={`grid ${compact ? 'grid-cols-4' : 'grid-cols-1 md:grid-cols-4'} gap-3`}>
        
        {/* Mục: Địa điểm */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-text group border border-transparent focus-within:border-blue-400 focus-within:bg-white">
          <MapPin className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full overflow-hidden">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Địa điểm</span>
            <input
              type="text"
              placeholder="Bạn muốn đi đâu?"
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 placeholder:text-gray-400"
            />
          </div>
        </div>

        {/* Mục: Nhận phòng */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-blue-400 focus-within:bg-white">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Nhận phòng</span>
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="Thêm ngày"
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Mục: Trả phòng */}
        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-blue-400 focus-within:bg-white">
          <Calendar className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
          <div className="flex flex-col w-full">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Trả phòng</span>
            <input
              type="text"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => (e.target.type = "text")}
              placeholder="Thêm ngày"
              className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 cursor-pointer"
            />
          </div>
        </div>

        {/* Mục: Số khách & Nút tìm kiếm */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all cursor-pointer group border border-transparent focus-within:border-blue-400 focus-within:bg-white flex-1">
            <Users className="w-5 h-5 text-blue-600 shrink-0 group-hover:scale-110 transition-transform" />
            <div className="flex flex-col w-full">
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Khách</span>
              <input
                type="text"
                placeholder="2 người"
                className="w-full bg-transparent outline-none text-[15px] font-medium text-gray-700 cursor-pointer"
              />
            </div>
          </div>
          
          <button
            className={`bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center shrink-0 
              ${compact ? 'w-12 h-12' : 'px-6 py-4 lg:px-8'}`}
          >
            <Search className="w-5 h-5" />
            {!compact && <span className="ml-2 font-semibold hidden lg:inline">Tìm kiếm</span>}
          </button>
        </div>

      </div>
    </div>
  );
}