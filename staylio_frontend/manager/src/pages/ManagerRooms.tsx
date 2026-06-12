/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import ManagerLayout from "../layout/ManagerLayout";
import RoomListView from "../components/rooms/RoomListView";
import RoomDetailModal from "../components/rooms/RoomDetailModal";
import type { RoomResponse } from "../../../common/interfaces/response/RoomResponse";
import { RoomStatus } from "../../../common/enums/RoomStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import { useHotelByManager } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useRoomById, useRooms, useUpdateRoomActiveMutation, useUpdateRoomVoucherMutation, useUpdateRoomStatusMutation } from "@common/hooks/useRooms";
import RoomFormAdd from "../components/rooms/RoomFormAdd";
import RoomFormUpdate from "../components/rooms/RoomFormUpdate";
import RoomToggleActiveModal from "../components/rooms/RoomToggleActiveModal";
import RoomToggleVoucherModal from "../components/rooms/RoomToggleVoucherModal";
import RoomUpdateStatusModal from "../components/rooms/RoomUpdateStatusModal";
import { BranchStatus } from "@common/enums/BranchStatus";
import { Button } from "@common/components/ui/button";

const SORT_OPTIONS = [
  { value: "id", label: "Mặc định" },
  { value: "roomName", label: "Tên phòng" },
  { value: "price", label: "Giá" },
  { value: "roomNumber", label: "Số phòng" },
];

export default function ManagerRooms() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBranchFilter, setSelectedBranchFilter] =
    useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<RoomResponse | null>(null);
  const [roomToUpdate, setRoomToUpdate] = useState<RoomResponse | null>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [roomToToggle, setRoomToToggle] = useState<RoomResponse | null>(null);
  const [isToggleModalOpen, setIsToggleModalOpen] = useState(false);
  const [roomToToggleVoucher, setRoomToToggleVoucher] = useState<RoomResponse | null>(null);
  const [isToggleVoucherModalOpen, setIsToggleVoucherModalOpen] = useState(false);
  const [roomToUpdateStatus, setRoomToUpdateStatus] = useState<RoomResponse | null>(null);
  const [isUpdateStatusModalOpen, setIsUpdateStatusModalOpen] = useState(false);
  const { data: hotel } = useHotelByManager();
  const { data: hotelBranches } = useMyHotelBranchs(hotel?.id || 0, BranchStatus.CONFIRMED);
  const { data: room } = useRoomById(selectedRoom?.id || 0);
  const { mutateAsync: toggleActive, isPending: isToggling } = useUpdateRoomActiveMutation(roomToToggle?.id ?? 0);
  const { mutateAsync: toggleVoucher, isPending: isTogglingVoucher } = useUpdateRoomVoucherMutation(roomToToggleVoucher?.id ?? 0);
  const { mutateAsync: updateStatus, isPending: isUpdatingStatus } = useUpdateRoomStatusMutation(roomToUpdateStatus?.id ?? 0);

  useEffect(() => {
    if (hotelBranches && hotelBranches.length > 0 && !selectedBranchFilter) {
      setSelectedBranchFilter(hotelBranches[0].id.toString());
    }
  }, [hotelBranches, selectedBranchFilter]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data, isLoading } = useRooms({
    search: debouncedSearch || undefined,
    status:
      selectedFilter === "all" ? undefined : (selectedFilter as RoomStatus),
    hotelBranchId:
      !selectedBranchFilter || selectedBranchFilter === "all"
        ? undefined
        : Number(selectedBranchFilter),
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

  const handleEdit = (room: RoomResponse) => {
    setRoomToUpdate(room);
    setIsUpdateModalOpen(true);
  };

  const handleToggleActive = (room: RoomResponse) => {
    setRoomToToggle(room);
    setIsToggleModalOpen(true);
  };

  const handleConfirmToggle = async () => {
    if (!roomToToggle) return;
    try {
      await toggleActive();
      setIsToggleModalOpen(false);
      setRoomToToggle(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleVoucher = (room: RoomResponse) => {
    setRoomToToggleVoucher(room);
    setIsToggleVoucherModalOpen(true);
  };

  const handleConfirmToggleVoucher = async () => {
    if (!roomToToggleVoucher) return;
    try {
      await toggleVoucher();
      setIsToggleVoucherModalOpen(false);
      setRoomToToggleVoucher(null);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateStatus = (room: RoomResponse) => {
    setRoomToUpdateStatus(room);
    setIsUpdateStatusModalOpen(true);
  };

  const handleConfirmUpdateStatus = async (newStatus: RoomStatus) => {
    if (!roomToUpdateStatus) return;
    try {
      await updateStatus(newStatus);
      setIsUpdateStatusModalOpen(false);
      setRoomToUpdateStatus(null);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ManagerLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quản lý phòng
            </h1>
            <p className="text-muted-foreground">
              Danh sách tất cả các phòng thuộc các chi nhánh của bạn
            </p>
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 shadow-sm shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm phòng mới</span>
          </Button>
        </div>

        <div className="bg-card text-foreground rounded-2xl p-6 border border-border shadow-sm flex flex-col gap-4">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên phòng, số phòng, chi nhánh..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-12 pr-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-foreground"
            />
          </div>

          <div className="flex flex-col lg:flex-row flex-wrap gap-4">
            <div className="relative min-w-48 lg:flex-1 xl:flex-none">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedBranchFilter}
                onChange={(e) => {
                  setSelectedBranchFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-8 py-3 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-foreground truncate"
              >
                <option value="all">Tất cả chi nhánh</option>
                {hotelBranches?.map((filter) => (
                  <option key={filter.id} value={filter.id}>
                    {filter.hotelBranchName}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            <div className="relative min-w-40 lg:flex-1 xl:flex-none">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-8 py-3 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-foreground truncate"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>

            {/* Sắp xếp */}
            <div className="flex gap-2 w-full lg:w-auto xl:ml-auto">
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-4 pr-8 py-3 bg-background border border-input rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all cursor-pointer font-medium text-foreground truncate"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sắp xếp theo {opt.label}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-muted-foreground">
                  <svg
                    className="fill-current h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>

              <Button
                variant="outline"
                onClick={() => {
                  setDirection(direction === "asc" ? "desc" : "asc");
                  setPage(0);
                }}
                className="px-4 py-3 rounded-xl h-auto"
              >
                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
              </Button>
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
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
          onToggleVoucher={handleToggleVoucher}
          onUpdateStatus={handleUpdateStatus}
        />
      </div>

      {selectedRoom && (
        <RoomDetailModal
          room={room}
          onClose={() => setSelectedRoom(null)}
        />
      )}

      <RoomFormAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <RoomFormUpdate
        isOpen={isUpdateModalOpen}
        onClose={() => {
          setIsUpdateModalOpen(false);
          setRoomToUpdate(null);
        }}
        room={roomToUpdate}
      />

      <RoomToggleActiveModal
        isOpen={isToggleModalOpen}
        onClose={() => {
          setIsToggleModalOpen(false);
          setRoomToToggle(null);
        }}
        onConfirm={handleConfirmToggle}
        isToggling={isToggling}
        room={roomToToggle}
      />

      <RoomToggleVoucherModal
        isOpen={isToggleVoucherModalOpen}
        onClose={() => {
          setIsToggleVoucherModalOpen(false);
          setRoomToToggleVoucher(null);
        }}
        onConfirm={handleConfirmToggleVoucher}
        isToggling={isTogglingVoucher}
        room={roomToToggleVoucher}
      />

      <RoomUpdateStatusModal
        isOpen={isUpdateStatusModalOpen}
        onClose={() => {
          setIsUpdateStatusModalOpen(false);
          setRoomToUpdateStatus(null);
        }}
        onConfirm={handleConfirmUpdateStatus}
        isToggling={isUpdatingStatus}
        room={roomToUpdateStatus}
      />
    </ManagerLayout>
  );
}