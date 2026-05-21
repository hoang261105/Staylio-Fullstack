import { Edit2, Eye, Power, Tag, Calendar, Percent, Coins, ShoppingCart, Trash2 } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import { VoucherStatus } from "../../../../common/enums/VoucherStatus";
import { DiscountType } from "../../../../common/enums/DiscountType";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";

interface VoucherListViewProps {
  vouchers: VoucherResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (voucher: VoucherResponse) => void;
  onEdit: (voucher: VoucherResponse) => void;
  onToggleActive: (voucher: VoucherResponse) => void;
  onDelete: (voucher: VoucherResponse) => void;
}

export default function VoucherListView({
  vouchers,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
  onEdit,
  onToggleActive,
  onDelete,
}: VoucherListViewProps) {
  const statusColors = {
    [VoucherStatus.ACTIVE]: "bg-green-50 text-green-700 border-green-200",
    [VoucherStatus.EXPIRED]: "bg-red-50 text-red-700 border-red-200",
    [VoucherStatus.DISABLED]: "bg-gray-50 text-gray-700 border-gray-200",
  };

  const statusLabels = {
    [VoucherStatus.ACTIVE]: "Đang hoạt động",
    [VoucherStatus.EXPIRED]: "Đã hết hạn",
    [VoucherStatus.DISABLED]: "Đã vô hiệu hóa",
  };

  const approvalStatusColors = {
    [ApprovalStatus.PENDING]: "bg-amber-50 text-amber-700 border-amber-200",
    [ApprovalStatus.CONFIRMED]: "bg-emerald-50 text-emerald-700 border-emerald-200",
    [ApprovalStatus.REJECTED]: "bg-rose-50 text-rose-700 border-rose-200",
    [ApprovalStatus.DELETED]: "bg-gray-100 text-gray-400 border-gray-200",
  };

  const approvalStatusLabels = {
    [ApprovalStatus.PENDING]: "Chờ duyệt",
    [ApprovalStatus.CONFIRMED]: "Đã duyệt",
    [ApprovalStatus.REJECTED]: "Từ chối",
    [ApprovalStatus.DELETED]: "Đã xóa",
  };

  const displayVouchers = vouchers?.filter(
    (voucher) => voucher.approvalStatus !== ApprovalStatus.DELETED
  ) || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-700 font-semibold">
            <tr>
              <th className="px-6 py-4">Voucher</th>
              <th className="px-6 py-4">Mức giảm</th>
              <th className="px-6 py-4">Điều kiện</th>
              <th className="px-6 py-4">Sử dụng</th>
              <th className="px-6 py-4">Thời hạn</th>
              <th className="px-6 py-4">Trạng thái hoạt động</th>
              <th className="px-6 py-4">Trạng thái duyệt</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
             {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : displayVouchers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy voucher nào
                </td>
              </tr>
            ) : (
              displayVouchers?.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0 border border-orange-100">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{voucher.title}</div>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 border border-gray-200">
                            {voucher.code}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#0066FF]">
                        {voucher.discountType === DiscountType.PERCENTAGE ? (
                          <><Percent className="w-3.5 h-3.5" /> Giảm {voucher.discountValue}%</>
                        ) : (
                          <><Coins className="w-3.5 h-3.5" /> Giảm {voucher.discountValue.toLocaleString("vi-VN")} ₫</>
                        )}
                      </div>
                      {voucher.maxDiscountAmount > 0 && voucher.discountType === DiscountType.PERCENTAGE && (
                        <div className="text-xs text-gray-500">
                          Tối đa: {voucher.maxDiscountAmount.toLocaleString("vi-VN")} ₫
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-gray-600">
                      <ShoppingCart className="w-3.5 h-3.5 text-gray-400" />
                      <span>Đơn tối thiểu: <span className="font-medium text-gray-900">{voucher.minOrderValue.toLocaleString("vi-VN")} ₫</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-gray-700">
                        {voucher.currentUsageCount} / {voucher.totalUsageLimit}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div
                          className="bg-[#0066FF] h-1.5 rounded-full"
                          style={{ width: `${Math.min((voucher.currentUsageCount / voucher.totalUsageLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Từ: {new Date(voucher.startDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-600">
                        <Calendar className="w-3.5 h-3.5 text-gray-400" />
                        <span>Đến: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[voucher.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {statusLabels[voucher.status] || voucher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${approvalStatusColors[voucher.approvalStatus] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {approvalStatusLabels[voucher.approvalStatus] || voucher.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {voucher.status === VoucherStatus.ACTIVE && (
                        <button
                          onClick={() => onToggleActive(voucher)}
                          className="p-1.5 rounded-lg transition-colors text-red-500 hover:bg-red-50"
                          title="Vô hiệu hóa"
                        >
                          <Power className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => onEdit(voucher)}
                        className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-lg transition-colors"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onView(voucher)}
                        className="p-1.5 text-gray-400 hover:text-[#0066FF] hover:bg-blue-50 rounded-lg transition-colors"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(voucher)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && displayVouchers.length > 0 && (
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/50">
          <div>
            Hiển thị <span className="font-medium text-gray-900">{displayVouchers.length}</span> trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span> voucher
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
