/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { RoomSearchCard } from "../components/RoomSearchCard";
import { useSearchRooms } from "../../../common/hooks/useRooms";
import Pagination from "../../../common/components/Pagination";
import { RoomStatus } from "../../../common/enums/RoomStatus";
import type { RoomSearchResponse } from "../../../common/interfaces/response/RoomSearchResponse";
import { useDebounce } from "../../../common/hooks/useDebounce";

export default function SearchRooms() {
  const [searchParams, setSearchParams] = useSearchParams();

  const initialKeyword = searchParams.get("keyword") || "";
  const initialCheckIn = searchParams.get("checkInDate") || "";
  const initialCheckOut = searchParams.get("checkOutDate") || "";
  const initialAdults = searchParams.get("adults") ? Number(searchParams.get("adults")) : undefined;

  const [searchInput, setSearchInput] = useState(initialKeyword);
  const debouncedSearch = useDebounce(searchInput, 500);

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [status, setStatus] = useState<RoomStatus | "">("");
  const [capacity, setCapacity] = useState<number | "">("");

  const [sortBy, setSortBy] = useState<string>("roomName");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const [page, setPage] = useState(1);

  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    if (debouncedSearch) newParams.set("keyword", debouncedSearch);
    else newParams.delete("keyword");
    setSearchParams(newParams);
  }, [debouncedSearch]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, minPrice, maxPrice, minRating, status, sortBy, direction, capacity]);

  const { data: searchResults, isLoading } = useSearchRooms({
    keyword: debouncedSearch,
    checkInDate: initialCheckIn || undefined,
    checkOutDate: initialCheckOut || undefined,
    adults: initialAdults,
    children: undefined,
    capacity: capacity !== "" ? Number(capacity) : undefined,
    page: page,
    size: 4,
    minPrice: minPrice !== "" ? Number(minPrice) : undefined,
    maxPrice: maxPrice !== "" ? Number(maxPrice) : undefined,
    minRating: minRating !== "" ? Number(minRating) : undefined,
    status: status || undefined,
    sortBy,
    direction
  });

  const rooms = searchResults?.items || [];
  const pagination = searchResults?.pagination;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans flex flex-col">
      <Header />

      <div className="bg-blue-600 pt-28 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 mt-6">Kết quả tìm kiếm</h1>
          <p className="text-blue-200">
            {pagination?.totalItems || 0} phòng được tìm thấy cho "{debouncedSearch || 'Tất cả'}"
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grow w-full flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-72 shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b dark:border-gray-700 border-gray-100 dark:border-gray-700">
              <Filter className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bộ lọc chi tiết</h2>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Trạng thái phòng</label>
              <select
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value as RoomStatus | "")}
              >
                <option value="">Tất cả trạng thái</option>
                <option value={RoomStatus.AVAILABLE}>Phòng trống (Available)</option>
                <option value={RoomStatus.OCCUPIED}>Đang sử dụng (Occupied)</option>
                <option value={RoomStatus.RESERVED}>Đã đặt (Reserved)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Khoảng giá (VND)</label>
              <div className="flex flex-col gap-3">
                <input
                  type="number"
                  min={0}
                  placeholder="Từ (VNĐ)"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                />
                <input
                  type="number"
                  min={0}
                  placeholder="Đến (VNĐ)"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Đánh giá tối thiểu (Số sao)</label>
              <input
                type="number"
                placeholder="Ví dụ: 4"
                min="0" max="5" step="0.5"
                value={minRating}
                onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Sức chứa tối thiểu (người)</label>
              <input
                type="number"
                placeholder="Ví dụ: 2"
                min="1"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value ? Number(e.target.value) : "")}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
              />
            </div>

            <button
              onClick={() => {
                setMinPrice(""); setMaxPrice("");
                setMinRating(""); setStatus("");
                setCapacity("");
              }}
              className="w-full mt-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-xl transition-colors text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="flex-1">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8 flex flex-col md:flex-row items-center justify-between gap-4">

            <form onSubmit={(e) => e.preventDefault()} className="relative w-full md:w-96 flex">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 sm:text-sm font-medium transition-all"
                placeholder="Tìm kiếm địa điểm, khách sạn..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600 w-full md:w-auto">
                <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500 shrink-0" />
                <select
                  className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer w-full"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="roomName">Tên phòng</option>
                  <option value="price">Giá phòng</option>
                  <option value="averageRating">Đánh giá sao</option>
                </select>
              </div>

              <button
                onClick={() => setDirection(d => d === "asc" ? "desc" : "asc")}
                className="flex items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200 shrink-0"
                title={direction === "asc" ? "Tăng dần" : "Giảm dần"}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-b dark:border-gray-700lue-600"></div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy kết quả</h3>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Vui lòng thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {rooms.map((room: RoomSearchResponse) => (
                  <RoomSearchCard key={room.roomId} room={room} />
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-8">
                  <Pagination
                    page={page - 1}
                    totalPages={pagination.totalPages}
                    onChange={(p) => setPage(p + 1)}
                  />
                </div>
              )}
            </>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}
