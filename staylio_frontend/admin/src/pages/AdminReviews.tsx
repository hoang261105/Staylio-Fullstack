/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import AdminReviewListView from "../components/reviews/AdminReviewListView";
import AdminReviewDetailModal from "../components/reviews/AdminReviewDetailModal";
import { ReviewStatus } from "@common/enums/ReviewStatus";
import { BranchStatus } from "@common/enums/BranchStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import { useReviews, useReviewers } from "@common/hooks/useReviews";
import { useAllHotels } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useAllRooms } from "@common/hooks/useRooms";
import type { ReviewResponse } from "@common/interfaces/response/ReviewResponse";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "rating", label: "Đánh giá" },
  { value: "replyAt", label: "Ngày phản hồi" },
  { value: "roomName", label: "Tên phòng" },
  { value: "customerName", label: "Tên khách hàng" },
];

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedHotel, setSelectedHotel] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  const [reviewToView, setReviewToView] = useState<ReviewResponse | null>(null);

  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: hotels } = useAllHotels();
  const selectedHotelId = selectedHotel !== "all" ? Number(selectedHotel) : 0;

  const { data: hotelBranches } = useMyHotelBranchs(
    selectedHotelId,
    BranchStatus.CONFIRMED,
  );

  const selectedBranchId =
    selectedBranch !== "all" ? Number(selectedBranch) : 0;
  const { data: rooms } = useAllRooms(selectedBranchId);

  // Fetch reviewers for the select dropdown
  const { data: reviewers } = useReviewers();

  useEffect(() => {
    setSelectedBranch("all");
    setSelectedRoom("all");
    setPage(0);
  }, [selectedHotel]);

  useEffect(() => {
    setSelectedRoom("all");
    setPage(0);
  }, [selectedBranch]);

  const { data: reviewsData, isLoading } = useReviews({
    search: debouncedSearch || undefined,
    status:
      selectedStatus === "all" ? undefined : (selectedStatus as ReviewStatus),
    hotelId: selectedHotel === "all" ? undefined : Number(selectedHotel),
    hotelBranchId: selectedBranch === "all" ? undefined : Number(selectedBranch),
    roomId: selectedRoom === "all" ? undefined : Number(selectedRoom),
    userId: selectedUser === "all" ? undefined : Number(selectedUser),
    checkInFrom: createdFrom || undefined,
    checkInTo: createdTo || undefined,
    page,
    size: 5,
    sortBy,
    direction,
  });

  const reviews = reviewsData?.items || [];
  const totalElements = reviewsData?.pagination?.totalItems || 0;
  const totalPages = reviewsData?.pagination?.totalPages || 0;

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý Đánh giá
            </h1>
            <p className="text-gray-500">
              Danh sách và thông tin tất cả đánh giá từ khách hàng trên toàn hệ thống
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          {/* Top row: Search & Date Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/3 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá, tên khách..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
              />
            </div>

            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-sm font-medium text-gray-600 w-full sm:w-auto shrink-0">
                  Từ ngày:
                </span>
                <input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => {
                    setCreatedFrom(e.target.value);
                    setPage(0);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border-transparent focus:border-[#0066FF] text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-sm font-medium text-gray-600 w-full sm:w-auto shrink-0">
                  Đến ngày:
                </span>
                <input
                  type="date"
                  value={createdTo}
                  onChange={(e) => {
                    setCreatedTo(e.target.value);
                    setPage(0);
                  }}
                  className="w-full px-3 py-2 bg-gray-50 rounded-xl border-transparent focus:border-[#0066FF] text-sm"
                />
              </div>
            </div>
          </div>

          {/* Filters Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] text-sm text-gray-700 truncate cursor-pointer"
              >
                <option value="all">Tất cả trạng thái</option>
                {Object.values(ReviewStatus).map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedHotel}
                onChange={(e) => {
                  setSelectedHotel(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] text-sm text-gray-700 truncate cursor-pointer"
              >
                <option value="all">Thương hiệu KS</option>
                {hotels?.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${selectedHotel === "all" ? "text-gray-300" : "text-gray-400"}`}
              />
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setPage(0);
                }}
                disabled={selectedHotel === "all"}
                className={`w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] text-sm truncate ${selectedHotel === "all" ? "text-gray-400 cursor-not-allowed opacity-60" : "text-gray-700 cursor-pointer"}`}
              >
                <option value="all">
                  {selectedHotel === "all"
                    ? "Chọn khách sạn trước"
                    : "Tất cả chi nhánh"}
                </option>
                {hotelBranches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.hotelBranchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${selectedBranch === "all" ? "text-gray-300" : "text-gray-400"}`}
              />
              <select
                value={selectedRoom}
                onChange={(e) => {
                  setSelectedRoom(e.target.value);
                  setPage(0);
                }}
                disabled={selectedBranch === "all"}
                className={`w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] text-sm truncate ${selectedBranch === "all" ? "text-gray-400 cursor-not-allowed opacity-60" : "text-gray-700 cursor-pointer"}`}
              >
                <option value="all">
                  {selectedBranch === "all"
                    ? "Chọn chi nhánh trước"
                    : "Tất cả phòng"}
                </option>
                {rooms?.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.roomName} (Số: {room.roomNumber})
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] text-sm text-gray-700 truncate cursor-pointer"
              >
                <option value="all">Tất cả khách hàng</option>
                {reviewers?.map((reviewer) => (
                  <option key={reviewer.id} value={reviewer.id}>
                    {reviewer.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 w-full lg:w-auto lg:ml-auto shrink-0 justify-end mt-2">
            <div className="relative w-48">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-4 pr-8 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] text-sm text-gray-700 truncate cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sắp xếp theo {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={() => {
                setDirection(direction === "asc" ? "desc" : "asc");
                setPage(0);
              }}
              className="px-4 py-2.5 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors text-sm border-gray-100 border"
            >
              {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
            </button>
          </div>
        </div>

        <AdminReviewListView
          reviews={reviews}
          isLoading={isLoading}
          totalElements={totalElements}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          onView={(review) => setReviewToView(review)}
        />
      </div>

      {reviewToView && (
        <AdminReviewDetailModal
          reviewId={reviewToView.id}
          onClose={() => setReviewToView(null)}
        />
      )}
    </AdminLayout>
  );
}
