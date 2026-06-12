import { Edit2, Eye, Power, Tag, Calendar, Percent, Coins, ShoppingCart, Trash2 } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import { VoucherStatus } from "../../../../common/enums/VoucherStatus";
import { DiscountType } from "../../../../common/enums/DiscountType";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import type { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { Button } from "../../../../common/components/ui/button";

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
    [VoucherStatus.DISABLED]: "bg-muted text-muted-foreground border-border",
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
    [ApprovalStatus.DELETED]: "bg-muted text-muted-foreground border-border",
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
    <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase text-foreground font-semibold">
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
          <tbody className="divide-y divide-border">
             {isLoading ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : displayVouchers.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-muted-foreground">
                  Không tìm thấy voucher nào
                </td>
              </tr>
            ) : (
              displayVouchers?.map((voucher) => (
                <tr key={voucher.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-lg flex items-center justify-center shrink-0 border border-orange-100">
                        <Tag className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{voucher.title}</div>
                        <div className="mt-0.5 flex items-center gap-1">
                          <span className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-muted text-foreground border border-border">
                            {voucher.code}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-sm font-medium text-primary">
                        {voucher.discountType === DiscountType.PERCENTAGE ? (
                          <><Percent className="w-3.5 h-3.5" /> Giảm {voucher.discountValue}%</>
                        ) : (
                          <><Coins className="w-3.5 h-3.5" /> Giảm {voucher.discountValue.toLocaleString("vi-VN")} ₫</>
                        )}
                      </div>
                      {voucher.maxDiscountAmount > 0 && voucher.discountType === DiscountType.PERCENTAGE && (
                        <div className="text-xs text-muted-foreground">
                          Tối đa: {voucher.maxDiscountAmount.toLocaleString("vi-VN")} ₫
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <ShoppingCart className="w-3.5 h-3.5 text-muted-foreground" />
                      <span>Đơn tối thiểu: <span className="font-medium text-foreground">{voucher.minOrderValue.toLocaleString("vi-VN")} ₫</span></span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-medium text-foreground">
                        {voucher.currentUsageCount} / {voucher.totalUsageLimit}
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${Math.min((voucher.currentUsageCount / voucher.totalUsageLimit) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Từ: {new Date(voucher.startDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Đến: {new Date(voucher.expiryDate).toLocaleDateString('vi-VN')}</span>
                      </div>
                    </div>
                  </td>
                   <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[voucher.status] || "bg-muted text-muted-foreground border-border"}`}>
                      {statusLabels[voucher.status] || voucher.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${approvalStatusColors[voucher.approvalStatus] || "bg-muted text-muted-foreground border-border"}`}>
                      {approvalStatusLabels[voucher.approvalStatus] || voucher.approvalStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {voucher.status === VoucherStatus.ACTIVE && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onToggleActive(voucher)}
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          title="Vô hiệu hóa"
                        >
                          <Power className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(voucher)}
                        className="text-muted-foreground hover:text-orange-500 hover:bg-orange-50"
                        title="Sửa thông tin"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onView(voucher)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(voucher)}
                        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        title="Xóa voucher"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-4 bg-muted/50">
          <div>
            Hiển thị <span className="font-medium text-foreground">{displayVouchers.length}</span> trên tổng số{" "}
            <span className="font-medium text-foreground">{totalElements}</span> voucher
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
