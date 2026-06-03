import { useState } from "react";
import { Search, Download, Plus } from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import CustomerStats from "../components/customers/CustomerStats";
import { useCustomers } from "../../../common/hooks/useCustomers";
import CustomerTable from "../components/customers/CustomerTable";
import { useDebounce } from "../../../common/hooks/useDebounce";
import Pagination from "../../../common/components/Pagination";
import CustomerForm from "../components/customers/CustomerForm";

const SORT_OPTIONS = [
  { value: "id", label: "ID" },
  { value: "fullName", label: "Tên" },
];

export default function AdminCustomers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [size] = useState(5);
  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState<"asc" | "desc">("asc");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const debouncedSearch = useDebounce(searchQuery, 500);

  const { data: customers, isLoading } = useCustomers({
    search: debouncedSearch,
    page,
    size,
    sortBy,
    direction,
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">
              Quản lý khách hàng
            </h1>
            <p className="text-gray-500">
              Danh sách và thông tin chi tiết khách hàng
            </p>
          </div>
          <button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] shadow-sm transition-colors font-medium"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm khách hàng</span>
          </button>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên, email, số điện thoại..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:border-transparent transition-all"
              />
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#0066FF]"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      Sắp xếp theo {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() =>
                  setDirection(direction === "asc" ? "desc" : "asc")
                }
                className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                {direction === "asc" ? "↑ Tăng dần" : "↓ Giảm dần"}
              </button>

              <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-700 font-medium">
                <Download className="w-5 h-5" />
                <span className="hidden sm:inline">Xuất Excel</span>
              </button>
            </div>
          </div>
        </div>

        <CustomerStats totalCustomers={customers?.pagination?.totalItems || 0} />

        {isLoading ? (
          <div className="text-center py-10">Đang tải...</div>
        ) : (
          <CustomerTable
            customers={customers?.items || []}
            sortBy={sortBy}
            direction={direction}
            onSort={(field) => {
              if (sortBy === field) {
                setDirection(direction === "asc" ? "desc" : "asc");
              } else {
                setSortBy(field);
                setDirection("asc");
              }
            }}
          />
        )}

        <Pagination
          page={page}
          totalPages={customers?.pagination?.totalPages || 0}
          onChange={setPage}
        />

        <CustomerForm 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
        />
      </div>
    </AdminLayout>
  );
}
