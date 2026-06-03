import { useState } from "react";
import { Search, Filter, Plus } from "lucide-react";
import ManagerLayout from "../layout/ManagerLayout";
import HotelBranchesListView from "../components/hotel-branches/HotelBranchesListView";
import { useDeleteHotelBranch, useHotelBranchs } from "@common/hooks/useHotelBranch";
import { BranchStatus } from "@common/enums/BranchStatus";
import { useDebounce } from "@common/hooks/useDebounce";
import { useHotelByManager } from "@common/hooks/useHotels";
import type { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import HotelBranchDetailModal from "../components/hotel-branches/HotelBranchDetailModal";
import HotelBranchFormAdd from "../components/hotel-branches/HotelBranchFormAdd";
import HotelBranchFormUpdate from "../components/hotel-branches/HotelBranchFormUpdate";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

export default function ManagerHotelBranches() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState<HotelBranchResponse | null>(null);
  const [editingBranch, setEditingBranch] = useState<HotelBranchResponse | null>(null);
  const [deletingBranchId, setDeletingBranchId] = useState<number | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [page, setPage] = useState(0);
  const debounceSearch = useDebounce(searchQuery, 500);
  const { data: hotel } = useHotelByManager();

  const { data, isLoading } = useHotelBranchs({
    page,
    size: 5,
    hotelId: hotel?.id,
    search: debounceSearch || undefined,
    status: selectedFilter !== "all" ? selectedFilter as BranchStatus : undefined,
  });

  const { mutateAsync: deleteBranch } = useDeleteHotelBranch({ hotelId: hotel?.id || 0 });

  const branches = data?.items || [];
  const totalElements = data?.pagination.totalItems || 0;
  const totalPages = data?.pagination.totalPages || 0;

  const filters = [
    { value: "all", label: "Tất cả" },
    { value: BranchStatus.CONFIRMED, label: "Đã duyệt" },
    { value: BranchStatus.PENDING, label: "Chờ duyệt" },
    { value: BranchStatus.REJECTED, label: "Từ chối" },
  ];

  const handleView = (branch: HotelBranchResponse) => {
    setSelectedBranch(branch);
  };

  const handleEdit = (branch: HotelBranchResponse) => {
    setEditingBranch(branch);
  };

  const handleDelete = (id: number) => {
    setDeletingBranchId(id);
  };

  const handleConfirmDelete = async () => {
    if (deletingBranchId) {
      try {
        await deleteBranch(deletingBranchId);
      } catch (error) {
        console.error("Lỗi khi xóa:", error);
      } finally {
        setDeletingBranchId(null);
      }
    }
  }

  return (
    <ManagerLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý chi nhánh
            </h1>
            <p className="text-gray-500">
              Danh sách các chi nhánh thuộc quyền quản lý của bạn
            </p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] text-white rounded-xl hover:bg-[#0052CC] shadow-sm shadow-[#0066FF]/20 font-medium transition-all"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm chi nhánh mới</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên chi nhánh, địa chỉ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
              />
            </div>

            <div className="relative min-w-50">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-8 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700"
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
          </div>
        </div>

        {/* Table View */}
        <HotelBranchesListView
          branches={branches}
          isLoading={isLoading}
          totalElements={totalElements}
          totalPages={totalPages}
          currentPage={page}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {selectedBranch && (
        <HotelBranchDetailModal
          branch={selectedBranch}
          onClose={() => setSelectedBranch(null)}
        />
      )}

      {showAddForm && (
        <HotelBranchFormAdd onClose={() => setShowAddForm(false)} />
      )}

      {editingBranch && (
        <HotelBranchFormUpdate 
          branch={editingBranch} 
          onClose={() => setEditingBranch(null)} 
        />
      )}

      {
        deletingBranchId && (
          <ConfirmDeleteModal 
            open={!!deletingBranchId} 
            onClose={() => setDeletingBranchId(null)} 
            onConfirm={handleConfirmDelete}
          />
        )
      }
    </ManagerLayout>
  );
}
