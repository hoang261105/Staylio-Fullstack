import { Eye, Edit2, Power } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { UtilityResponse } from "../../../../common/interfaces/response/UtilityResponse";
import { getUtilityIcon } from "../../../../common/utils/iconUtils";

interface UtilityListViewProps {
  utilities: UtilityResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (utility: UtilityResponse) => void;
  onEdit: (utility: UtilityResponse) => void;
  onToggleActive: (utility: UtilityResponse) => void;
}

export default function UtilityListView({
  utilities,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onToggleActive,
}: UtilityListViewProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Tên tiện ích</th>
              <th className="px-6 py-4">Mô tả</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : utilities.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy tiện ích nào
                </td>
              </tr>
            ) : (
              utilities.map((utility) => {
                const Icon = getUtilityIcon(utility.iconName);
                return (
                  <tr key={utility.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded-lg flex items-center justify-center shrink-0 overflow-hidden border border-blue-100 p-2">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">{utility.title}</div>
                          <div className="text-xs text-gray-500 mt-0.5 font-medium">Icon: {utility.iconName}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600 truncate max-w-[250px]" title={utility.description}>
                        {utility.description || "Chưa có mô tả"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                          !utility.isDeleted
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                        }`}
                      >
                        {!utility.isDeleted ? "Đang hoạt động" : "Ngừng hoạt động"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => onToggleActive(utility)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            utility.isDeleted
                              ? "text-green-500 hover:bg-green-50"
                              : "text-red-500 hover:bg-red-50"
                          }`}
                          title={utility.isDeleted ? "Kích hoạt" : "Ngừng hoạt động"}
                        >
                          <Power className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(utility)}
                          className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                          title="Sửa thông tin"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onView(utility)}
                          className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                          title="Xem chi tiết"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && utilities.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/50">
          <div>
            Hiển thị <span className="font-medium text-gray-900">{utilities.length}</span> trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span> tiện ích
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
