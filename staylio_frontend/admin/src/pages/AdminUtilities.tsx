import { useState } from "react";
import { Search, Plus } from "lucide-react";
import UtilityListView from "../components/utilities/UtilityListView";
import UtilityDetailModal from "../components/utilities/UtilityDetailModal";
import UtilityFormAdd from "../components/utilities/UtilityFormAdd";
import UtilityFormEdit from "../components/utilities/UtilityFormEdit";
import ConfirmUtilityStatusModal from "../components/utilities/ConfirmUtilityStatusModal";
import type { UtilityResponse } from "../../../common/interfaces/response/UtilityResponse";
import { useDebounce } from "@common/hooks/useDebounce";
import { useUtilities } from "@common/hooks/useUtilities";
import AdminLayout from "../layout/AdminLayout";

const SORT_OPTIONS = [
  { value: "id", label: "Mặc định" },
  { value: "title", label: "Tên tiện ích" },
];

export default function AdminUtilities() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUtility, setSelectedUtility] =
    useState<UtilityResponse | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingUtility, setEditingUtility] = useState<UtilityResponse | null>(null);
  const [togglingUtility, setTogglingUtility] = useState<UtilityResponse | null>(null);
  const [page, setPage] = useState(0);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: utilitiesData, isLoading } = useUtilities({
    search: debouncedSearch,
    page,
    size: 5,
    sortBy,
    direction,
  });

  const handleView = (utility: UtilityResponse) => {
    setSelectedUtility(utility);
  };

  const handleEdit = (utility: UtilityResponse) => {
    setEditingUtility(utility);
  };

  const handleToggleActive = (utility: UtilityResponse) => {
    setTogglingUtility(utility);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Quản lý tiện ích
            </h1>
            <p className="text-gray-500">
              Danh sách tất cả các tiện ích của hệ thống
            </p>
          </div>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#0066FF] text-white rounded-xl hover:bg-[#0052CC] shadow-sm shadow-[#0066FF]/20 font-medium transition-all cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm tiện ích</span>
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col gap-4">
          <div className="w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên tiện ích..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all"
            />
          </div>

          <div className="flex flex-col lg:flex-row flex-wrap gap-4">
            {/* Sắp xếp */}
            <div className="flex gap-2 w-full lg:w-auto xl:ml-auto">
              <div className="relative flex-1 lg:flex-none">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-4 pr-8 py-3 bg-gray-50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-[#0066FF] focus:ring-4 focus:ring-[#0066FF]/10 focus:bg-white transition-all cursor-pointer font-medium text-gray-700 truncate"
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
                className="px-4 py-3 bg-gray-50 border border-transparent rounded-xl hover:bg-gray-100 text-gray-700 font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <UtilityListView
          utilities={utilitiesData?.items || []}
          isLoading={isLoading}
          totalElements={utilitiesData?.pagination?.totalItems || 0}
          totalPages={utilitiesData?.pagination?.totalPages || 0}
          currentPage={page}
          onPageChange={setPage}
          onView={handleView}
          onEdit={handleEdit}
          onToggleActive={handleToggleActive}
        />
      </div>

      {selectedUtility && (
        <UtilityDetailModal
          utility={selectedUtility}
          onClose={() => setSelectedUtility(null)}
        />
      )}

      <UtilityFormAdd
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      <UtilityFormEdit
        utility={editingUtility}
        onClose={() => setEditingUtility(null)}
      />

      {togglingUtility && (
        <ConfirmUtilityStatusModal
          utility={togglingUtility}
          onClose={() => setTogglingUtility(null)}
        />
      )}
    </AdminLayout>
  );
}
