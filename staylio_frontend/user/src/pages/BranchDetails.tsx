import { useState, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Search, MapPin, Star, Filter, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useRooms } from "../../../common/hooks/useRooms";
import { useHotelBranchById } from "../../../common/hooks/useHotelBranch";
import { RoomStatus } from "../../../common/enums/RoomStatus";
import RoomCard from "../components/RoomCard";
import BranchMap from "../components/BranchMap";
import NearbyPlacesList from "../components/NearbyPlacesList";
import { useDebounce } from "../../../common/hooks/useDebounce";
import { useNearbyPlaces } from "../../../common/hooks/useNearbyPlaces";

export default function BranchDetails() {
  const { branchId } = useParams();

  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<RoomStatus | "">("");

  const [sortBy, setSortBy] = useState<string>("averageRating");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [minRating, setMinRating] = useState<number | "">("");
  const [maxRating, setMaxRating] = useState<number | "">("");

  const { data: branchInfo } = useHotelBranchById(Number(branchId));
  const debouncedSearch = useDebounce(searchInput, 500);

  const { data: roomsData, isLoading: isLoadingRooms } = useRooms({
    hotelBranchId: Number(branchId),
    page: 0,
    size: 1000,
    search: debouncedSearch,
    status: status || undefined,
    sortBy,
    direction
  });

  const { data: nearbyPlaces, isLoading: isLoadingNearby } = useNearbyPlaces(
    branchInfo?.latitude || null,
    branchInfo?.longitude || null
  );

  const filteredRooms = useMemo(() => {
    if (!roomsData?.items) return [];

    let result = [...roomsData.items];

    if (minPrice !== "") {
      result = result.filter(r => r.price >= Number(minPrice));
    }
    if (maxPrice !== "") {
      result = result.filter(r => r.price <= Number(maxPrice));
    }
    if (minRating !== "") {
      result = result.filter(r => (r.averageRating || 0) >= Number(minRating));
    }
    if (maxRating !== "") {
      result = result.filter(r => (r.averageRating || 0) <= Number(maxRating));
    }

    return result;
  }, [roomsData, minPrice, maxPrice, minRating, maxRating]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 font-sans flex flex-col">
      <Header />

      <div className="relative h-80 bg-gray-900">
        <img
          src={branchInfo?.imageUrl || "https://images.unsplash.com/photo-1542314831-c6a4d2706864?q=80&w=2000&auto=format&fit=crop"}
          alt={branchInfo?.hotelBranchName}
          className="w-full h-full object-cover opacity-50"
        />
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-10">
            <div className="inline-block bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wider">
              {branchInfo?.hotelName || "Khách sạn"}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {branchInfo?.hotelBranchName || "Đang tải..."}
            </h1>
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 text-gray-800 dark:text-gray-200">
                <MapPin className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                <span className="text-sm font-medium">
                  {branchInfo ? `${branchInfo.address}, ${branchInfo.wardName}, ${branchInfo.provinceName}` : "Đang tải địa chỉ..."}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-gray-800/30 backdrop-blur-md px-3 py-1.5 rounded-lg border border-gray-100 dark:border-white/10 text-gray-800 dark:text-gray-200">
                <Star className="w-4 h-4 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                <span className="text-sm font-medium">
                  {branchInfo?.averageRating || "0.0"} ({branchInfo?.countReview || 0} đánh giá)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-grow w-full flex flex-col md:flex-row gap-8">

        <div className="w-full md:w-72 flex-shrink-0">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-28">
            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
              <Filter className="w-5 h-5 text-gray-700 dark:text-gray-200" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Bộ lọc tìm kiếm</h2>
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
                <option value={RoomStatus.MAINTENANCE}>Đang bảo trì (Maintenance)</option>
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Khoảng giá (VND)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Từ"
                  value={minPrice}
                  min={0}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                />
                <span className="text-gray-400 dark:text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Đến"
                  value={maxPrice}
                  min={1}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-3">Đánh giá (Số sao)</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Min (0-5)"
                  min="0" max="5"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                />
                <span className="text-gray-400 dark:text-gray-500">-</span>
                <input
                  type="number"
                  placeholder="Max (0-5)"
                  min="0" max="5"
                  value={maxRating}
                  onChange={(e) => setMaxRating(e.target.value ? Number(e.target.value) : "")}
                  className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-900 dark:text-white rounded-xl focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 block p-3 text-sm font-medium outline-none transition-all"
                />
              </div>
            </div>

            <button
              onClick={() => {
                setMinPrice(""); setMaxPrice("");
                setMinRating(""); setMaxRating("");
                setStatus("");
                setSearchInput("");
              }}
              className="w-full mt-2 py-3 px-4 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:bg-gray-600 text-gray-800 dark:text-gray-100 font-semibold rounded-xl transition-colors text-sm"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>

        <div className="flex-1">

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 mb-8 flex flex-col sm:flex-row items-center justify-between gap-4">

            <form onSubmit={(e) => e.preventDefault()} className="relative w-full sm:w-96">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-3 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-b dark:border-gray-700lue-500 sm:text-sm font-medium transition-all"
                placeholder="Tìm kiếm tên phòng..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </form>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-gray-700 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-600">
                <SlidersHorizontal className="w-4 h-4 text-gray-500 dark:text-gray-400 dark:text-gray-500" />
                <select
                  className="bg-transparent text-sm font-semibold text-gray-700 dark:text-gray-200 outline-none cursor-pointer"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="averageRating">Đánh giá sao</option>
                  <option value="price">Giá phòng</option>
                  <option value="roomName">Tên phòng</option>
                  <option value="roomNumber">Số phòng</option>
                </select>
              </div>

              <button
                onClick={() => setDirection(d => d === "asc" ? "desc" : "asc")}
                className="flex items-center justify-center p-3 rounded-xl bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:bg-gray-700 transition-colors text-gray-700 dark:text-gray-200"
                title={direction === "asc" ? "Tăng dần" : "Giảm dần"}
              >
                <ArrowUpDown className="w-4 h-4" />
              </button>
            </div>
          </div>

          {isLoadingRooms ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-b dark:border-gray-700lue-600"></div>
            </div>
          ) : filteredRooms.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-400 dark:text-gray-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Không tìm thấy phòng</h3>
              <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">Không có phòng nào phù hợp với bộ lọc hiện tại của bạn. Vui lòng thử lại với các tiêu chí khác.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredRooms.map((room) => (
                <RoomCard key={room.id} room={room} branchInfo={branchInfo} />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* Vị trí chi nhánh section */}
      {branchInfo?.latitude && branchInfo?.longitude && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 w-full">
          <hr className="border-gray-200 dark:border-gray-600 mb-10" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Xung quanh {branchInfo.hotelBranchName} có gì?
          </h2>
          <p className="text-gray-900 dark:text-white mb-10 text-lg">{branchInfo.address}, {branchInfo.wardName}, {branchInfo.provinceName}</p>
          <BranchMap
            latitude={branchInfo.latitude}
            longitude={branchInfo.longitude}
            branchName={branchInfo.hotelBranchName}
            address={branchInfo.address}
            nearbyPlaces={nearbyPlaces}
          />
          <NearbyPlacesList places={nearbyPlaces || []} isLoading={isLoadingNearby} />
        </div>
      )}

      <Footer />
    </div>
  );
}
