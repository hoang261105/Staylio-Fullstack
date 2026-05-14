/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import RoomListView from "../components/rooms/RoomListView";
import RoomDetailModal from "../components/rooms/RoomDetailModal";
import type { RoomResponse } from "../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../common/enums/RoomStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import { useHotels } from "@common/hooks/useHotels";
import { useHotelBranchs } from "@common/hooks/useHotelBranch";
import { useRoomById, useRooms } from "@common/hooks/useRooms";
import AdminLayout from "../layout/AdminLayout";

const SORT_OPTIONS = [
  { value: "id", label: "Mặc định" },
  { value: "roomName", label: "Tên phòng" },
  { value: "price", label: "Giá" },
  { value: "roomNumber", label: "Số phòng" },
];

export default function ManagerRooms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>("all");
  const [selectedBranchFilter, setSelectedBranchFilter] =
    useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const { data: hotelsData } = useHotels({ page: 0, size: 100 });
  const hotels = hotelsData?.items || [];
  const { data: room } = useRoomById(selectedRoom?.id || 0);
  console.log(selectedRoom?.id)

  const { data: branchesData } = useHotelBranchs({
    page: 0,
    size: 100,
    hotelId:
      selectedHotelFilter === "all" ? undefined : Number(selectedHotelFilter),
  });
  const hotelBranches = branchesData?.items || [];

  useEffect(() => {
    // Reset branch when hotel changes
    setSelectedBranchFilter("all");
  }, [selectedHotelFilter]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading } = useRooms({
    search: debouncedSearch || undefined,
    status:
      selectedFilter === "all" ? undefined : (selectedFilter as RoomStatus),
    hotelBranchId:
      selectedBranchFilter === "all" ? undefined : Number(selectedBranchFilter),
    page,
    size: 5,
    sortBy: sortBy === "id" ? undefined : sortBy,
    direction: sortBy === "id" ? undefined : direction,
  });

  const rooms = data?.items || [];
  const totalElements = data?.pagination?.totalItems || 0;
  const totalPages = data?.pagination?.totalPages || 0;

  const filters = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: RoomStatus.AVAILABLE, label: "Trống" },
    { value: RoomStatus.OCCUPIED, label: "Đang sử dụng" },
    { value: RoomStatus.RESERVED, label: "Đã đặt trước" },
    { value: RoomStatus.MAINTENANCE, label: "Bảo trì" },
  ];

  const handleView = (room: RoomResponse) => {
    setSelectedRoom(room);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý phòng
            </h1>
            <p className="text-gray-500">
              Danh sách tất cả các phòng thuộc tất cả chi nhánh
            </p>
          </div>
          <button
            onClick={() => {}}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] text-white rounded-xl hover:bg-[#0052CC] shadow-sm shadow-[#0066FF]/20 font-medium transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm phòng mới</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phòng, số phòng, chi nhánh..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center flex-wrap gap-4">
            <div className="relative w-full sm:w-55 shrink-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedHotelFilter}
                onChange={(e) => {
                  setSelectedHotelFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-9 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
              >
                <option value="all">Tất cả thương hiệu</option>
                {hotels?.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-60 shrink-0">
              <Filter
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${
                  selectedHotelFilter === "all"
                    ? "text-gray-300"
                    : "text-gray-400"
                }`}
              />
              <select
                value={selectedBranchFilter}
                onChange={(e) => {
                  setSelectedBranchFilter(e.target.value);
                  setPage(0);
                }}
                disabled={selectedHotelFilter === "all"}
                className={`w-full pl-12 pr-9 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all font-medium truncate ${
                  selectedHotelFilter === "all"
                    ? "opacity-60 cursor-not-allowed text-gray-400"
                    : "cursor-pointer focus:bg-white text-gray-700"
                }`}
              >
                <option value="all">
                  {selectedHotelFilter === "all"
                    ? "Chọn thương hiệu"
                    : "Tất cả chi nhánh"}
                </option>
                {hotelBranches?.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.hotelBranchName}
                  </option>
                ))}
              </select>
              <div
                className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${
                  selectedHotelFilter === "all"
                    ? "text-gray-300"
                    : "text-gray-500"
                }`}
              >
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative w-full sm:w-47.5 shrink-0">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-9 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="flex gap-2 w-full sm:w-auto lg:ml-auto shrink-0">
              <div className="relative flex-1 sm:w-55 sm:flex-none shrink-0">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-4 pr-9 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <button
                onClick={() => {
                  setDirection(direction === "asc" ? "desc" : "asc");
                  setPage(0);
                }}
                className="px-4 py-3 bg-gray-50 border border-transparent rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors whitespace-nowrap shrink-0"
              >
                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <RoomListView
          rooms={rooms}
          isLoading={isLoading}
          totalElements={totalElements}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          onView={handleView}
        />
      </div>

      {selectedRoom && (
        <RoomDetailModal
          room={room}
          onClose={() => setSelectedRoom(null)}
        />
      )}
    </AdminLayout>
  );
}
