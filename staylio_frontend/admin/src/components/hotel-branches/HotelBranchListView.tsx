import { useState } from "react";
import { Eye, MapPin, Building2, Image as ImageIcon, Gavel } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { HotelBranchResponse } from "../../../../common/interfaces/response/HotelBranchResponse";
import { BranchStatus } from "../../../../common/enums/BranchStatus";
import { useApproveHotelBranch } from "../../../../common/hooks/useHotelBranch";
import HotelBranchApproveModal from "./HotelBranchApproveModal";

interface HotelBranchListViewProps {
  branches: HotelBranchResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (branch: HotelBranchResponse) => void;
}

export default function HotelBranchListView({
  branches,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
}: HotelBranchListViewProps) {
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    branchId: number | null;
  }>({
    open: false,
    branchId: null,
  });

  const { mutateAsync: updateBranchStatus } = useApproveHotelBranch();

  const statusColors = {
    CONFIRMED: "bg-green-50 text-green-700 border-green-200",
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    REJECTED: "bg-red-50 text-red-700 border-red-200",
    DELETED: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const statusLabels = {
    CONFIRMED: "Đã duyệt",
    PENDING: "Chờ duyệt",
    REJECTED: "Từ chối",
    DELETED: "Đã xóa",
  };

  const handleOpenConfirm = (id: number) => {
    setConfirmModal({
      open: true,
      branchId: id,
    });
  };

  const handleConfirmAction = (status: BranchStatus) => {
    if (confirmModal.branchId) {
      updateBranchStatus({ id: confirmModal.branchId, status });
      setConfirmModal({ open: false, branchId: null });
    }
  };

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-700 font-semibold">
              <tr>
                <th className="px-6 py-4">Chi nhánh</th>
                <th className="px-6 py-4">Địa chỉ</th>
                <th className="px-6 py-4">Thuộc khách sạn</th>
                <th className="px-6 py-4 text-center">Sức chứa</th>
                <th className="px-6 py-4">Trạng thái</th>
                <th className="px-6 py-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Đang tải dữ liệu...
                  </td>
                </tr>
              ) : branches.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    Không tìm thấy chi nhánh nào
                  </td>
                </tr>
              ) : (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-gray-100">
                          {branch.imageUrl ? (
                            <img src={branch.imageUrl} alt={branch.hotelBranchName} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{branch.hotelBranchName}</div>
                          <div className="text-xs text-gray-500 mt-0.5">ID: {branch.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-start gap-1.5 max-w-xs">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span className="truncate" title={`${branch.address}, ${branch.wardName}, ${branch.provinceName}`}>
                          {branch.address}, {branch.wardName}, {branch.provinceName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-gray-400" />
                        <span className="font-medium text-gray-700">{branch.hotelName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">{branch.capacity}</div>
                        <div className="text-xs text-gray-500">người</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[branch.status as keyof typeof statusColors] || statusColors.DELETED
                          }`}
                      >
                        {statusLabels[branch.status as keyof typeof statusLabels] || branch.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onView(branch)}
                          className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {branch.status === BranchStatus.PENDING && (
                          <button
                            onClick={() => handleOpenConfirm(branch.id)}
                            className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                            title="Xét duyệt chi nhánh"
                          >
                            <Gavel className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && branches.length > 0 && (
          <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/50">
            <div>
              Hiển thị <span className="font-medium text-gray-900">{branches.length}</span> trên tổng số{" "}
              <span className="font-medium text-gray-900">{totalElements}</span> chi nhánh
            </div>
            <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
          </div>
        )}
      </div>

      <HotelBranchApproveModal
        open={confirmModal.open}
        onClose={() => setConfirmModal({ open: false, branchId: null })}
        onConfirm={handleConfirmAction}
      />
    </>
  );
}
