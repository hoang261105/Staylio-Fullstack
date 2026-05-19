/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Image as ImageIcon,
  Building2,
  MapPin,
  Bed,
  Calendar,
  CheckCircle2,
  Clock,
  XCircle,
  Trash2,
  Star,
  ChevronDown,
  Eye,
  Check,
} from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import AdminRoomImageDetail from "../components/room-images/AdminRoomImageDetail";
import { useRoomImages } from "@common/hooks/useRoomImage";
import { useAllHotels } from "@common/hooks/useHotels";
import { useMyHotelBranchs } from "@common/hooks/useHotelBranch";
import { useAllRooms } from "@common/hooks/useRooms";
import { useDebounce } from "@common/hooks/useDebounce";
import { ImageStatus } from "@common/enums/ImageStatus";
import Pagination from "@common/components/Pagination";
import { BranchStatus } from "@common/enums/BranchStatus";
import type { HotelResponse } from "@common/interfaces/response/HotelResponse";
import type { RoomResponse } from "@common/interfaces/response/RoomResponse";
import ConfirmRoomImageStatusModal from "@common/components/ConfirmRoomImageStatusModal";

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

export default function AdminRoomImages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHotel, setSelectedHotel] = useState<string>("all");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [selectedRoom, setSelectedRoom] = useState<string>("all");
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(0);

  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [confirmImageId, setConfirmImageId] = useState<number | null>(null);
  const [confirmImageStatus, setConfirmImageStatus] =
    useState<ImageStatus | null>(null);
  const [confirmRoomName, setConfirmRoomName] = useState("");
  const [confirmRoomNumber, setConfirmRoomNumber] = useState("");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: hotels } = useAllHotels();

  const hotelId = selectedHotel === "all" ? undefined : Number(selectedHotel);
  const hotelBranchId =
    selectedBranch === "all" ? undefined : Number(selectedBranch);

  const { data: branches } = useMyHotelBranchs(
    hotelId!,
    BranchStatus.CONFIRMED,
  );

  const { data: rooms } = useAllRooms(hotelBranchId!);

  useEffect(() => {
    setSelectedBranch("all");
    setSelectedRoom("all");
    setPage(0);
  }, [selectedHotel]);

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

  const getStatusBadge = (status: ImageStatus) => {
    switch (status) {
      case ImageStatus.CONFIRMED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Đã xác nhận
          </span>
        );
      case ImageStatus.PENDING:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Chờ duyệt
          </span>
        );
      case ImageStatus.REJECTED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200">
            <XCircle className="w-3.5 h-3.5" />
            Bị từ chối
          </span>
        );
      case ImageStatus.DELETED:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
            <Trash2 className="w-3.5 h-3.5" />
            Đã xóa
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <AdminLayout>
      {selectedDetailId !== null ? (
        <AdminRoomImageDetail
          imageId={selectedDetailId}
          onClose={() => setSelectedDetailId(null)}
        />
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                <ImageIcon className="w-8 h-8 text-[#0066FF]" />
                Quản lý hình ảnh phòng
              </h1>
              <p className="text-gray-500">
                Xem và kiểm duyệt hình ảnh của tất cả các phòng trong hệ thống
                Staylio
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-5">
            <div className="w-full relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm hình ảnh theo tên phòng, mã phòng..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                <select
                  value={selectedHotel}
                  onChange={(e) => setSelectedHotel(e.target.value)}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
                >
                  <option value="all">Tất cả thương hiệu</option>
                  {hotels?.map((h: HotelResponse) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <MapPin
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none ${selectedHotel === "all" ? "text-gray-300" : "text-gray-400"}`}
                />
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  disabled={selectedHotel === "all"}
                  className={`w-full pl-12 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all font-medium truncate ${
                    selectedHotel === "all"
                      ? "opacity-60 cursor-not-allowed text-gray-400"
                      : "cursor-pointer focus:bg-white text-gray-700"
                  }`}
                >
                  <option value="all">
                    {selectedHotel === "all"
                      ? "Chọn thương hiệu trước"
                      : "Tất cả chi nhánh"}
                  </option>
                  {branches?.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.hotelBranchName}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <Bed
                  className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 z-10 pointer-events-none ${selectedBranch === "all" ? "text-gray-300" : "text-gray-400"}`}
                />
                <select
                  value={selectedRoom}
                  onChange={(e) => {
                    setSelectedRoom(e.target.value);
                    setPage(0);
                  }}
                  disabled={selectedBranch === "all"}
                  className={`w-full pl-12 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all font-medium truncate ${
                    selectedBranch === "all"
                      ? "opacity-60 cursor-not-allowed text-gray-400"
                      : "cursor-pointer focus:bg-white text-gray-700"
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
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>

              <div className="relative">
                <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10 pointer-events-none" />
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-500 font-bold uppercase tracking-wider self-center mr-auto sm:mb-0 mb-2">
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
                    className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 text-sm"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        Sắp xếp theo: {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                </div>

                <button
                  onClick={() => {
                    setDirection(direction === "asc" ? "desc" : "asc");
                    setPage(0);
                  }}
                  className="px-4 py-2.5 bg-gray-50 border border-transparent rounded-xl hover:bg-gray-100 text-gray-700 font-medium text-sm transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5"
                >
                  {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
                </button>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center gap-3 shadow-sm">
              <div className="w-10 h-10 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium">
                Đang tải danh sách hình ảnh...
              </p>
            </div>
          ) : roomImages.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-20 flex flex-col items-center justify-center text-center shadow-sm">
              <ImageIcon className="w-16 h-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-bold text-gray-900 mb-1">
                Không tìm thấy hình ảnh nào
              </h3>
              <p className="text-gray-500 max-w-md">
                Thử thay đổi bộ lọc tìm kiếm hoặc các cấp thương hiệu, chi nhánh
                để tìm được kết quả mong muốn.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {roomImages.map((img) => (
                  <div
                    key={img.id}
                    className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md hover:border-blue-100 transition-all duration-300 flex flex-col"
                  >
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-gray-100">
                      <img
                        src={img.imageUrl}
                        alt={img.roomName}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      <div className="absolute inset-0 p-3 flex flex-col justify-between pointer-events-none">
                        <div className="flex items-start justify-between w-full">
                          {img.isPrimary ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-[#0066FF] text-white shadow-lg shadow-blue-500/20 backdrop-blur-sm">
                              <Star className="w-3 h-3 fill-current" />
                              Ảnh chính
                            </span>
                          ) : (
                            <div />
                          )}
                          <div className="pointer-events-auto">
                            {getStatusBadge(img.status)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 flex-1 flex flex-col justify-between space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-start gap-2.5">
                          <Bed className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-snug group-hover:text-[#0066FF] transition-colors line-clamp-1">
                              {img.roomName}
                            </h4>
                            <p className="text-xs font-semibold text-gray-500 mt-0.5">
                              Mã phòng:{" "}
                              <span className="text-gray-900">
                                {img.roomNumber}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="space-y-1.5 pl-7">
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <MapPin className="w-3.5 h-3.5 text-gray-400" />
                            <span
                              className="truncate"
                              title={img.hotelBranchName}
                            >
                              {img.hotelBranchName}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                            <Building2 className="w-3.5 h-3.5 text-gray-400" />
                            <span className="truncate" title={img.ownerName}>
                              Chủ thương hiệu: {img.ownerName}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-400 font-medium">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {new Date(img.createdAt).toLocaleDateString(
                              "vi-VN",
                            )}
                          </span>
                        </div>
                        <span className="text-gray-300">ID: {img.id}</span>
                      </div>

                      {img.status === ImageStatus.REJECTED &&
                        img.rejectionReason && (
                          <div className="mt-2 p-2 bg-red-50/50 rounded-lg border border-red-100 text-[11px] text-red-700 leading-relaxed font-medium">
                            <strong className="text-red-800">
                              Lý do từ chối:{" "}
                            </strong>
                            {img.rejectionReason}
                          </div>
                        )}

                      {(() => {
                        const showApprove = img.status === ImageStatus.PENDING;
                        const showDelete = img.status === ImageStatus.REJECTED;

                        let colsClass = "grid-cols-3";
                        if (showApprove && showDelete) {
                          colsClass = "grid-cols-3";
                        } else if (!showApprove && showDelete) {
                          colsClass = "grid-cols-2";
                        } else if (!showApprove && !showDelete) {
                          colsClass = "grid-cols-1";
                        }

                        return (
                          <div
                            className={`pt-3 border-t border-gray-100 grid ${colsClass} gap-2`}
                          >
                            <button
                              onClick={() => setSelectedDetailId(img.id)}
                              className="flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 active:scale-95 transition-all cursor-pointer"
                              title="Xem chi tiết"
                            >
                              <Eye className="w-3.5 h-3.5" />
                              <span>Chi tiết</span>
                            </button>

                            {showApprove && (
                              <button
                                onClick={() => {
                                  setConfirmImageId(img.id);
                                  setConfirmImageStatus(ImageStatus.CONFIRMED);
                                  setConfirmRoomName(img.roomName);
                                  setConfirmRoomNumber(img.roomNumber);
                                  setConfirmModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 active:scale-95 transition-all cursor-pointer"
                                title="Duyệt hình ảnh"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Duyệt</span>
                              </button>
                            )}

                            {showDelete && (
                              <button
                                onClick={() => {
                                  setConfirmImageId(img.id);
                                  setConfirmImageStatus(ImageStatus.DELETED);
                                  setConfirmRoomName(img.roomName);
                                  setConfirmRoomNumber(img.roomNumber);
                                  setConfirmModalOpen(true);
                                }}
                                className="flex items-center justify-center gap-1 py-2 px-1 text-xs font-bold rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 active:scale-95 transition-all cursor-pointer"
                                title="Xóa hình ảnh"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Xóa</span>
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="p-4 bg-white rounded-2xl border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 shadow-sm">
                  <div>
                    Hiển thị{" "}
                    <span className="font-medium text-gray-900">
                      {roomImages.length}
                    </span>{" "}
                    trên tổng số{" "}
                    <span className="font-medium text-gray-900">
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
    </AdminLayout>
  );
}
