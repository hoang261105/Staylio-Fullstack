import { useState } from "react";
import { Search, Filter } from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import HotelBranchStats from "../components/hotel-branches/HotelBranchStats";
import HotelBranchListView from "../components/hotel-branches/HotelBranchListView";
import HotelBranchModal from "../components/hotel-branches/HotelBranchDetailModal";
import type { BranchStatus } from "../../../common/enums/BranchStatus";
import { useHotelBranchs } from "../../../common/hooks/useHotelBranch";
import { useDebounce } from "../../../common/hooks/useDebounce";
import type { HotelBranchResponse } from "../../../common/interfaces/response/HotelBranchResponse";

export default function AdminHotelBranches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState<HotelBranchResponse | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const debounceSearch = useDebounce(searchQuery, 500);

  const { data: hotelBranchs, isLoading } = useHotelBranchs({
    page: currentPage,
    size: 5,
    search: debounceSearch || undefined,
    status: selectedFilter !== "all" ? (selectedFilter as BranchStatus) : undefined,
  });

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: "PENDING", label: "Chờ duyệt" },
    { value: "CONFIRMED", label: "Đã duyệt" },
    { value: "REJECTED", label: "Từ chối" },
    { value: "DELETED", label: "Đã xóa" },
  ];

  const handleView = (branch: HotelBranchResponse) => {
    setSelectedBranch(branch);
  };

  const handleCloseModal = () => {
    setSelectedBranch(null);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl mb-2">Quản lý chi nhánh</h1>
            <p className="text-muted-foreground">
              Danh sách các chi nhánh khách sạn
            </p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên chi nhánh, địa chỉ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(0);
                }}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all"
              />
            </div>

            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setCurrentPage(0);
                }}
                className="pl-10 pr-8 py-2 border border-gray-200 rounded-lg shadow-sm appearance-none bg-white focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 transition-all"
              >
                {filters.map((filter) => (
                  <option key={filter.value} value={filter.value}>
                    {filter.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <HotelBranchStats />

        <HotelBranchListView
          branches={hotelBranchs?.items || []}
          isLoading={isLoading}
          onView={handleView}
          totalElements={hotelBranchs?.pagination.totalItems || 0}
          totalPages={hotelBranchs?.pagination.totalPages || 0}
          currentPage={currentPage}
          onPageChange={setCurrentPage}
        />
      </div>

      {selectedBranch && (
        <HotelBranchModal
          branch={selectedBranch}
          onClose={handleCloseModal}
        />
      )}
    </AdminLayout>
  );
}