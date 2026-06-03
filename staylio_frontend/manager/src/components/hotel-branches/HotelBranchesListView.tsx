import { Eye, Edit, Trash2, MapPin, Building, Users } from "lucide-react";
import { BranchStatus } from "@common/enums/BranchStatus";
import type { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import Pagination from "@common/components/Pagination";

interface HotelBranchesListViewProps {
  branches: HotelBranchResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (branch: HotelBranchResponse) => void;
  onEdit: (branch: HotelBranchResponse) => void;
  onDelete: (id: number) => void;
}

const getStatusConfig = (status: BranchStatus) => {
  switch (status) {
    case BranchStatus.CONFIRMED:
      return {
        label: "Đã duyệt",
        color: "bg-green-50 text-green-700 border-green-200",
        dot: "bg-green-500",
      };
    case BranchStatus.REJECTED:
      return {
        label: "Từ chối",
        color: "bg-red-50 text-red-700 border-red-200",
        dot: "bg-red-500",
      };
    case BranchStatus.PENDING:
      return {
        label: "Đang chờ duyệt",
        color: "bg-yellow-50 text-yellow-700 border-yellow-200",
        dot: "bg-yellow-500",
      };
    default:
      return {
        label: status,
        color: "bg-gray-50 text-gray-700 border-gray-200",
        dot: "bg-gray-500",
      };
  }
};

export default function HotelBranchesListView({
  branches,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onDelete
}: HotelBranchesListViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 text-xs uppercase text-gray-700 font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-4">Chi nhánh</th>
              <th className="px-6 py-4">Địa chỉ</th>
              <th className="px-6 py-4">Sức chứa</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  Không tìm thấy chi nhánh nào
                </td>
              </tr>
            ) : (
              branches.map((branch) => (
                <tr
                  key={branch.id}
                  className="hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {branch.imageUrl ? (
                        <img
                          src={branch.imageUrl}
                          alt={branch.hotelBranchName}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center text-blue-500">
                          <Building className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-gray-900">
                          {branch.hotelBranchName}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          Thuộc:{" "}
                          <span className="font-medium text-gray-700">
                            {branch.hotelName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1.5 max-w-xs">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                      <span
                        className="truncate"
                        title={`${branch.address}, ${branch.wardName}, ${branch.provinceName}`}
                      >
                        {branch.address}, {branch.wardName},{" "}
                        {branch.provinceName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                      <Users className="w-4 h-4 text-gray-400" />
                      {branch.capacity}{" "}
                      <span className="text-gray-500 font-normal">người</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusConfig(branch.status).color}`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${getStatusConfig(branch.status).dot}`}
                      ></span>
                      {getStatusConfig(branch.status).label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(branch)}
                        className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(branch)}
                        className="p-1.5 text-gray-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      {branch.status !== BranchStatus.CONFIRMED && (
                        <button
                          onClick={() => onDelete(branch.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa chi nhánh"
                        >
                          <Trash2 className="w-4 h-4" />
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
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4">
          <div>
            Hiển thị{" "}
            <span className="font-medium text-gray-900">{branches.length}</span>{" "}
            trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span>{" "}
            chi nhánh
          </div>
          <Pagination
            page={currentPage}
            totalPages={totalPages}
            onChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
}
