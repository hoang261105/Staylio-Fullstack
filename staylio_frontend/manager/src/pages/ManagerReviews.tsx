/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import ManagerLayout from "../layout/ManagerLayout";
import ManagerReviewListView from "../components/reviews/ManagerReviewListView";
import ManagerReviewDetailModal from "../components/reviews/ManagerReviewDetailModal";
import { ReviewStatus } from "@common/enums/ReviewStatus";
import { BranchStatus } from "@common/enums/BranchStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import { useReviews, useReviewers } from "@common/hooks/useReviews";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useAllRooms } from "@common/hooks/useRooms";
import type { ReviewResponse } from "@common/interfaces/response/ReviewResponse";
import { Button } from "@common/components/ui/button";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "rating", label: "Đánh giá" },
  { value: "replyAt", label: "Ngày phản hồi" },
  { value: "roomName", label: "Tên phòng" },
  { value: "customerName", label: "Tên khách hàng" },
];

export default function ManagerReviews() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedUser, setSelectedUser] = useState<string>("all");

  const [reviewToView, setReviewToView] = useState<ReviewResponse | null>(null);

  const [createdFrom, setCreatedFrom] = useState<string>("");
  const [createdTo, setCreatedTo] = useState<string>("");

  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state && location.state.reviewId) {
      setReviewToView({ id: location.state.reviewId } as ReviewResponse);
      // Clear the state so it doesn't reopen on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: hotel } = useHotelByManager();
  const hotelId = hotel?.id || 0;

  const { data: hotelBranches } = useMyHotelBranchs(
    hotelId,
    BranchStatus.CONFIRMED,
  );

  const selectedBranchId =
    selectedBranch !== "all" ? Number(selectedBranch) : 0;
  const { data: rooms } = useAllRooms(selectedBranchId);

  // Fetch reviewers for the select dropdown
  const { data: reviewers } = useReviewers();

  // Reset room selection when branch changes
  useEffect(() => {
    setSelectedRoom("all");
    setPage(0);
  }, [selectedBranch]);

  const { data: reviewsData, isLoading } = useReviews({
    search: debouncedSearch || undefined,
    status:
      selectedStatus === "all" ? undefined : (selectedStatus as ReviewStatus),
    hotelBranchId:
      selectedBranch === "all" ? undefined : Number(selectedBranch),
    roomId: selectedRoom === "all" ? undefined : Number(selectedRoom),
    userId: selectedUser === "all" ? undefined : Number(selectedUser),
    createdFrom: createdFrom || undefined,
    createdTo: createdTo || undefined,
    page,
    size: 5,
    sortBy,
    direction,
  });

  const reviews = reviewsData?.items || [];
  const totalElements = reviewsData?.pagination?.totalItems || 0;
  const totalPages = reviewsData?.pagination?.totalPages || 0;

  return (
    <ManagerLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quản lý Đánh giá
            </h1>
            <p className="text-muted-foreground">
              Danh sách và thông tin các đánh giá từ khách hàng
            </p>
          </div>
        </div>

        <div className="bg-card text-foreground rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4">
          {/* Top row: Search & Date Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="w-full lg:w-1/3 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm đánh giá, tên khách..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
              />
            </div>

            <div className="w-full lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground w-full sm:w-auto shrink-0">
                  Từ ngày:
                </span>
                <input
                  type="date"
                  value={createdFrom}
                  onChange={(e) => setCreatedFrom(e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground rounded-xl border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm"
                />
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground w-full sm:w-auto shrink-0">
                  Đến ngày:
                </span>
                <input
                  type="date"
                  value={createdTo}
                  onChange={(e) => setCreatedTo(e.target.value)}
                  className="w-full px-3 py-2 bg-background text-foreground rounded-xl border border-input focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none text-sm"
                />
              </div>
            </div>
          </div>

          {/* Bottom row: Dropdown filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedStatus}
                onChange={(e) => {
                  setSelectedStatus(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary text-sm text-foreground truncate cursor-pointer"
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
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary text-sm text-foreground truncate cursor-pointer"
              >
                <option value="all">Tất cả chi nhánh</option>
                {hotelBranches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.hotelBranchName}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative">
              <Filter
                className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${selectedBranch === "all" ? "text-muted-foreground/50" : "text-muted-foreground"}`}
              />
              <select
                value={selectedRoom}
                onChange={(e) => {
                  setSelectedRoom(e.target.value);
                  setPage(0);
                }}
                disabled={selectedBranch === "all"}
                className={`w-full pl-9 pr-8 py-2.5 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary text-sm truncate ${selectedBranch === "all" ? "text-muted-foreground cursor-not-allowed opacity-60" : "text-foreground cursor-pointer"}`}
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
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <select
                value={selectedUser}
                onChange={(e) => {
                  setSelectedUser(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-9 pr-8 py-2.5 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary text-sm text-foreground truncate cursor-pointer"
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
                className="w-full pl-4 pr-8 py-2.5 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary text-sm text-foreground truncate cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    Sắp xếp theo {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="outline"
              onClick={() => {
                setDirection(direction === "asc" ? "desc" : "asc");
                setPage(0);
              }}
              className="px-4 py-2.5 rounded-xl text-sm"
            >
              {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
            </Button>
          </div>
        </div>

        <ManagerReviewListView
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
        <ManagerReviewDetailModal
          reviewId={reviewToView.id}
          onClose={() => setReviewToView(null)}
        />
      )}
    </ManagerLayout>
  );
}
