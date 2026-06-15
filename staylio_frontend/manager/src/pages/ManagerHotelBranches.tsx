/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
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
import ManagerBranchChatsModal from "../components/hotel-branches/ManagerBranchChatsModal";
import { Button } from "@common/components/ui/button";
import { useGetChatSessionByIdQuery } from "@common/hooks/useChatSession";

export default function ManagerHotelBranches() {
  const location = useLocation();
  const navigate = useNavigate();
  const chatSessionId = location.state?.chatSessionId;
  const { data: targetSession } = useGetChatSessionByIdQuery(chatSessionId || 0);
  const [initialSessionId, setInitialSessionId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [selectedBranch, setSelectedBranch] = useState<HotelBranchResponse | null>(null);
  const [chatBranch, setChatBranch] = useState<HotelBranchResponse | null>(null);
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
  }, { enabled: !!hotel?.id });

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

  const handleViewChats = (branchId: number) => {
    const branch = branches.find(b => b.id === branchId);
    if (branch) setChatBranch(branch);
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

  useEffect(() => {
    if (chatSessionId && targetSession && branches.length > 0) {
      const branch = branches.find(b => b.id === targetSession.branchId);
      if (branch) {
        setChatBranch(branch);
        setInitialSessionId(chatSessionId);
        navigate(location.pathname, { replace: true });
      }
    }
  }, [chatSessionId, targetSession, branches, navigate, location.pathname]);

  return (
    <ManagerLayout>
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Quản lý chi nhánh
            </h1>
            <p className="text-muted-foreground">
              Danh sách các chi nhánh thuộc quyền quản lý của bạn
            </p>
          </div>
          <Button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl shadow-sm shadow-primary/20"
          >
            <Plus className="w-5 h-5" />
            <span>Thêm chi nhánh mới</span>
          </Button>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Tìm kiếm theo tên chi nhánh, địa chỉ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-4 py-3 bg-muted/50 border border-transparent rounded-xl focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all text-foreground"
              />
            </div>

            <div className="relative min-w-50">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <select
                value={selectedFilter}
                onChange={(e) => {
                  setSelectedFilter(e.target.value);
                  setPage(0);
                }}
                className="w-full pl-12 pr-8 py-3 bg-muted/50 border border-transparent rounded-xl appearance-none focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 focus:bg-background transition-all cursor-pointer font-medium text-foreground"
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
          onViewChats={handleViewChats}
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

      {chatBranch && (
        <ManagerBranchChatsModal
          branchId={chatBranch.id}
          branchName={chatBranch.hotelBranchName}
          initialSessionId={initialSessionId || undefined}
          onClose={() => {
            setChatBranch(null);
            setInitialSessionId(null);
          }}
        />
      )}
    </ManagerLayout>
  );
}
