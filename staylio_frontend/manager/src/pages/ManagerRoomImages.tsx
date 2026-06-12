/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Image as ImageIcon,
  ChevronDown,
  Bed,
  MapPin,
} from "lucide-react";
import { useRoomImages } from "@common/hooks/useRoomImage";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useAllRooms } from "@common/hooks/useRooms";
import { useDebounce } from "@common/hooks/useDebounce";
import { ImageStatus } from "@common/enums/ImageStatus";
import Pagination from "@common/components/Pagination";
import { BranchStatus } from "@common/enums/BranchStatus";
import type { RoomResponse } from "@common/interfaces/response/RoomResponse";
import ManagerLayout from "../layout/ManagerLayout";
import ManagerRoomImageDetail from "../components/room-images/ManagerRoomImageDetail";
import RoomImageListView from "../components/room-images/RoomImageListView";
import ConfirmRoomImageStatusModal from "@common/components/ConfirmRoomImageStatusModal";
import { Button } from "@common/components/ui/button";

const SORT_OPTIONS = [
  { value: "createdAt", label: "Ngày tạo" },
  { value: "roomName", label: "Tên phòng" },
  { value: "roomNumber", label: "Mã phòng" },
  { value: "hotelBranchName", label: "Tên chi nhánh" },
  { value: "ownerName", label: "Tên chủ thương hiệu" },
  { value: "isPrimary", label: "Ảnh chính" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: ImageStatus.PENDING, label: "Chờ duyệt (PENDING)" },
  { value: ImageStatus.CONFIRMED, label: "Đã xác nhận (CONFIRMED)" },
  { value: ImageStatus.REJECTED, label: "Bị từ chối (REJECTED)" },
  { value: ImageStatus.DELETED, label: "Đã xóa (DELETED)" },
];

export default function ManagerRoomImages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmImageId, setConfirmImageId] = useState<number | null>(null);
  const [confirmImageStatus, setConfirmImageStatus] = useState<ImageStatus | null>(null);
  const [confirmRoomName, setConfirmRoomName] = useState("");
  const [confirmRoomNumber, setConfirmRoomNumber] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: hotel } = useHotelByManager();

  const hotelBranchId =
    selectedBranch === "all" ? undefined : Number(selectedBranch);

  const { data: branches } = useMyHotelBranchs(
    hotel?.id || 0,
    BranchStatus.CONFIRMED,
  );

  const { data: rooms } = useAllRooms(hotelBranchId!);

  useEffect(() => {
    setSelectedBranch("all");
    setSelectedRoom("all");
    setPage(0);
  }, [hotel?.id]);

  useEffect(() => {
    if (selectedBranch !== "all" && rooms && rooms.length > 0) {
      setSelectedRoom(String(rooms[0].id));
    } else {
      setSelectedRoom("all");
    }
    setPage(0);
  }, [selectedBranch, rooms]);

  const { data: roomImagesData, isLoading } = useRoomImages({
    search: debouncedSearch || undefined,
    roomId: selectedRoom === "all" ? undefined : Number(selectedRoom),
    status:
      selectedStatus === "all" ? undefined : (selectedStatus as ImageStatus),
    sortBy,
    direction,
    page,
    size: 4,
  });

  const roomImages = roomImagesData?.items || [];
  const totalElements = roomImagesData?.pagination?.totalItems || 0;
  const totalPages = roomImagesData?.pagination?.totalPages || 0;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <ManagerLayout>
      {selectedDetailId !== null ? (
        <ManagerRoomImageDetail imageId={selectedDetailId} onClose={() => setSelectedDetailId(null)} role="manager" />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-primary" />
                Quản lý hình ảnh phòng
              </h1>
              <p className="text-muted-foreground">
                Xem và kiểm duyệt hình ảnh của tất cả các phòng trong hệ thống
                Staylio
              </p>
            </div>
          </div>

          <div className="bg-card text-foreground rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-5">
            <div className="w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm hình ảnh theo tên phòng, mã phòng..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-foreground truncate"
                >
                  <option value="all">Tất cả chi nhánh</option>
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.hotelBranchName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <div className="relative">
                <Bed
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none ${selectedBranch === "all" ? "text-muted-foreground/50" : "text-muted-foreground"}`}
                />
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    setPage(0);
                  }}
                  disabled={selectedBranch === "all"}
                  className={`w-full pl-12 pr-10 py-3 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium truncate ${selectedBranch === "all"
                    ? "opacity-60 cursor-not-allowed text-muted-foreground"
                    : "cursor-pointer text-foreground"
                    }`}
                >
                  {selectedBranch === "all" ? (
                    <option value="all">Chọn chi nhánh trước</option>
                  ) : rooms?.length === 0 ? (
                    <option value="all">Không có phòng nào</option>
                  ) : (
                    rooms?.map((r: RoomResponse) => (
                      <option key={r.id} value={r.id}>
                        {r.roomName} ({r.roomNumber})
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground z-10 pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-12 pr-10 py-3 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-foreground truncate"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-border">
              <span className="text-xs text-muted-foreground font-bold uppercase tracking-wider self-center mr-auto sm:mb-0 mb-2">
                Sắp xếp danh sách
              </span>
              <div className="flex flex-wrap gap-2">
                <div className="relative min-w-50 flex-1 sm:flex-none">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setPage(0);
                    }}
                    className="w-full pl-4 pr-10 py-2.5 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-foreground text-sm"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        Sắp xếp theo: {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>

                <Button
                  variant="outline"
                  onClick={() => {
                    setDirection(direction === "asc" ? "desc" : "asc");
                    setPage(0);
                  }}
                  className="px-4 py-2.5 rounded-xl flex items-center gap-1.5 h-auto text-sm"
                >
                  {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
                </Button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-card rounded-2xl border border-border p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground font-medium">
                Đang tải danh sách hình ảnh...
              </p>
            </div>
          ) : roomImages.length === 0 ? (
            <div className="bg-card rounded-2xl border border-border p-20 flex flex-col items-center justify-center text-center shadow-sm">
              <ImageIcon className="w-16 h-16 text-muted mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-1">
                Không tìm thấy hình ảnh nào
              </h3>
              <p className="text-muted-foreground max-w-md">
                Thử thay đổi bộ lọc tìm kiếm hoặc các cấp thương hiệu, chi nhánh
                để tìm được kết quả mong muốn.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <RoomImageListView
                roomImages={roomImages}
                onViewDetail={setSelectedDetailId}
                onDelete={(img) => {
                  setConfirmImageId(img.id);
                  setConfirmImageStatus(ImageStatus.DELETED);
                  setConfirmRoomName(img.roomName);
                  setConfirmRoomNumber(img.roomNumber);
                  setConfirmModalOpen(true);
                }}
              />

              {totalPages > 0 && (
                <div className="p-4 bg-card rounded-2xl border border-border flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-4 shadow-sm">
                  <div>
                    Hiển thị{" "}
                    <span className="font-medium text-foreground">
                      {roomImages.length}
                    </span>{" "}
                    trên tổng số{" "}
                    <span className="font-medium text-foreground">
                      {totalElements}
                    </span>{" "}
                    hình ảnh phòng
                  </div>
                  <Pagination
                    page={page}
                    totalPages={totalPages}
                    onChange={handlePageChange}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}
      <ConfirmRoomImageStatusModal
        isOpen={confirmModalOpen}
        onClose={() => setConfirmModalOpen(false)}
        imageId={confirmImageId}
        status={confirmImageStatus}
        roomName={confirmRoomName}
        roomNumber={confirmRoomNumber}
      />
    </ManagerLayout>
  );
}
