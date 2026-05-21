/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import { Search, Filter } from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import AdminVoucherListView from "../components/vouchers/AdminVoucherListView";
import AdminVoucherDetailModal from "../components/vouchers/AdminVoucherDetailModal";
import AdminVoucherToggleStatusModal from "../components/vouchers/AdminVoucherToggleStatusModal";
import AdminVoucherDeleteModal from "../components/vouchers/AdminVoucherDeleteModal";
import AdminVoucherApproveModal from "../components/vouchers/AdminVoucherApproveModal";
import AdminVoucherRejectModal from "../components/vouchers/AdminVoucherRejectModal";
import { VoucherStatus } from "@common/enums/VoucherStatus";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import { useHotels } from "@common/hooks/useHotels";
import { useHotelBranchs } from "@common/hooks/useHotelBranch";
import { useVouchers, useVoucherById } from "@common/hooks/useVouchers";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const SORT_OPTIONS = [
  { value: "id", label: "Mặc định" },
  { value: "title", label: "Tên Voucher" },
  { value: "code", label: "Mã Voucher" },
];

export default function AdminVouchers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>("all");
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const [selectedVoucher, setSelectedVoucher] = useState<VoucherResponse | null>(null);
  const [voucherToToggle, setVoucherToToggle] = useState<VoucherResponse | null>(null);
  const [voucherToDelete, setVoucherToDelete] = useState<VoucherResponse | null>(null);
  const [voucherToApprove, setVoucherToApprove] = useState<VoucherResponse | null>(null);
  const [voucherToReject, setVoucherToReject] = useState<VoucherResponse | null>(null);

  const queryClient = useQueryClient();

  const { data: hotelsData } = useHotels({ page: 0, size: 100 });
  const hotels = hotelsData?.items || [];

  const { data: branchesData } = useHotelBranchs({
    page: 0,
    size: 100,
    hotelId: selectedHotelFilter === "all" ? undefined : Number(selectedHotelFilter),
  });
  const hotelBranches = branchesData?.items || [];

  // Reset branch selection when brand changes
  useEffect(() => {
    setSelectedBranchFilter("all");
  }, [selectedHotelFilter]);

  const debouncedSearch = useDebounce(searchQuery, 500);

  // Fetch vouchers list
  const { data: vouchersData, isLoading } = useVouchers({
    search: debouncedSearch || undefined,
    status: selectedFilter === "all" ? undefined : (selectedFilter as VoucherStatus),
    hotelBranchId: selectedBranchFilter === "all" ? undefined : Number(selectedBranchFilter),
    hotelId: (selectedHotelFilter !== "all" && selectedBranchFilter === "all") ? Number(selectedHotelFilter) : undefined,
    page,
    size: 5,
    sortBy: sortBy === "id" ? undefined : sortBy,
    direction: sortBy === "id" ? undefined : direction,
  });

  const vouchers = vouchersData?.items || [];
  const totalElements = vouchersData?.pagination?.totalItems || 0;
  const totalPages = vouchersData?.pagination?.totalPages || 0;

  // Detailed fetch for the modal view
  const { data: voucherDetails } = useVoucherById(selectedVoucher?.id || 0);

  const filters = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: VoucherStatus.ACTIVE, label: "Đang hoạt động" },
    { value: VoucherStatus.EXPIRED, label: "Đã hết hạn" },
    { value: VoucherStatus.DISABLED, label: "Đã vô hiệu hóa" },
  ];

  const handleView = (voucher: VoucherResponse) => {
    setSelectedVoucher(voucher);
  };

  const handleToggleActive = (voucher: VoucherResponse) => {
    setVoucherToToggle(voucher);
  };

  const handleApprove = (voucher: VoucherResponse) => {
    setVoucherToApprove(voucher);
  };

  const handleReject = (voucher: VoucherResponse) => {
    setVoucherToReject(voucher);
  };

  const handleDeleteClick = (voucher: VoucherResponse) => {
    setVoucherToDelete(voucher);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        {/* Header section */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý Voucher
            </h1>
            <p className="text-gray-500">
              Danh sách tất cả voucher của các chi nhánh và thương hiệu trên hệ thống
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          {/* Keyword Search */}
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên voucher, mã code..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center flex-wrap gap-4">
            {/* Brand (Hotel) Filter */}
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
                {hotels?.map((hotel) => (
                  <option key={hotel.id} value={hotel.id}>
                    {hotel.name}
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

            {/* Branch Filter */}
            <div className="relative w-full sm:w-60 shrink-0">
              <Filter
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 ${selectedHotelFilter === "all" ? "text-gray-300" : "text-gray-400"
                  }`}
              />
              <select
                value={selectedBranchFilter}
                onChange={(e) => {
                  setSelectedBranchFilter(e.target.value);
                  setPage(0);
                }}
                disabled={selectedHotelFilter === "all"}
                className={`w-full pl-12 pr-9 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all font-medium truncate ${selectedHotelFilter === "all"
                    ? "opacity-60 cursor-not-allowed text-gray-400"
                    : "cursor-pointer focus:bg-white text-gray-700"
                  }`}
              >
                <option value="all">
                  {selectedHotelFilter === "all" ? "Chọn thương hiệu" : "Tất cả chi nhánh"}
                </option>
                {hotelBranches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.hotelBranchName}
                  </option>
                ))}
              </select>
              <div
                className={`pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 ${selectedHotelFilter === "all" ? "text-gray-300" : "text-gray-500"
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

            {/* Status Filter */}
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

            {/* Sorting controls */}
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
                      Sắp xếp theo {opt.label}
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
                className="px-4 py-3 bg-gray-50 border border-transparent rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors whitespace-nowrap shrink-0 border-gray-100 border"
              >
                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
              </button>
            </div>
          </div>
        </div>

        {/* Voucher List */}
        <AdminVoucherListView
          vouchers={vouchers}
          isLoading={isLoading}
          totalElements={totalElements}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          onView={handleView}
          onToggleActive={handleToggleActive}
          onApprove={handleApprove}
          onReject={handleReject}
          onDelete={handleDeleteClick}
        />
      </div>

      {/* View Detail Modal */}
      {selectedVoucher && (
        <AdminVoucherDetailModal
          voucher={voucherDetails || selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
        />
      )}

      {/* Toggle Active Status Modal */}
      {voucherToToggle && (
        <AdminVoucherToggleStatusModal
          voucher={voucherToToggle}
          onClose={() => setVoucherToToggle(null)}
        />
      )}

      {/* Delete Voucher Modal */}
      {voucherToDelete && (
        <AdminVoucherDeleteModal
          voucher={voucherToDelete}
          onClose={() => setVoucherToDelete(null)}
        />
      )}

      {/* Approve Voucher Modal */}
      {voucherToApprove && (
        <AdminVoucherApproveModal
          voucher={voucherToApprove}
          onClose={() => setVoucherToApprove(null)}
        />
      )}

      {/* Reject Voucher Modal */}
      {voucherToReject && (
        <AdminVoucherRejectModal
          voucher={voucherToReject}
          onClose={() => setVoucherToReject(null)}
        />
      )}
    </AdminLayout>
  );
}
