import { useState } from "react";
import { Search, Download, Plus } from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import HotelStats from "../components/hotels/HotelStats";
import HotelGridView from "../components/hotels/HotelGridView";
import HotelListView from "../components/hotels/HotelListView";
import { useHotels } from "../../../common/hooks/useHotels";
import Pagination from "../../../common/components/Pagination";
import type { HotelResponse } from "../../../common/interfaces/response/HotelResponse";
import { useDebounce } from "../../../common/hooks/useDebounce";

const SORT_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "name", label: "Tên" },
];

export default function AdminHotels() {
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(0);
  const size = viewMode === "grid" ? 3 : 5;
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: hotels, isLoading } = useHotels({
    search: debouncedSearch,
    page,
    size,
    sortBy,
    direction,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Quản lý khách sạn
            </h1>
            <p className="text-gray-500">
              Danh sách thương hiệu và cơ sở khách sạn
            </p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] shadow-sm transition-colors font-medium">
            <Plus className="w-5 h-5" />
            <span>Thêm khách sạn</span>
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, địa điểm, ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sắp xếp theo {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() =>
                  setDirection(direction === "asc" ? "desc" : "asc")
                }
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
              </button>

              {/* View Mode Toggle */}
              <div className="flex border border-gray-200 rounded-lg p-0.5 bg-gray-50">
                <button
                  onClick={() => {
                    setViewMode("grid");
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === "grid"
                    ? "bg-white text-[#0066FF] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="Dạng lưới"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    setViewMode("list");
                    setPage(0);
                  }}
                  className={`px-3 py-1.5 rounded-md transition-colors ${viewMode === "list"
                    ? "bg-white text-[#0066FF] shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                    }`}
                  title="Dạng danh sách"
                >
                  <svg
                    className="w-5 h-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                  </svg>
                </button>
              </div>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors font-medium">
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Xuất báo cáo</span>
              </button>
            </div>
          </div>
        </div>

        <HotelStats
          totalHotels={hotels?.pagination?.totalItems || 0}
          activeHotels={hotels?.items?.filter((hotel: HotelResponse) => hotel.active).length || 0}
        />

        {isLoading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : viewMode === "grid" ? (
          <HotelGridView
            hotels={hotels?.items || []}
          />
        ) : (
          <HotelListView
            hotels={hotels?.items || []}
            direction={direction}
            onSort={(field) => {
              if (sortBy === field) {
                setDirection(direction === "asc" ? "desc" : "asc");
              } else {
                setSortBy(field);
                setDirection("asc");
              }
            }}
          />
        )}
      </div>

      <div className="mt-8">
        <Pagination
          page={page}
          totalPages={hotels?.pagination?.totalPages || 0}
          onChange={setPage}
        />
      </div>
    </AdminLayout>
  );
}
