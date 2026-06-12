import { Eye, Edit, Trash2, MapPin, Building, Users } from "lucide-react";
import { BranchStatus } from "@common/enums/BranchStatus";
import type { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import Pagination from "@common/components/Pagination";
import { Button } from "@common/components/ui/button";

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
  onViewChats?: (branchId: number) => void;
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
  onDelete,
  onViewChats
}: HotelBranchesListViewProps) {
  return (
    <div className="bg-card rounded-2xl shadow-sm overflow-hidden border border-border">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/50 text-xs uppercase text-foreground font-semibold border-b border-border">
            <tr>
              <th className="px-6 py-4">Chi nhánh</th>
              <th className="px-6 py-4">Địa chỉ</th>
              <th className="px-6 py-4">Sức chứa</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Đang tải dữ liệu...
                </td>
              </tr>
            ) : branches.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-12 text-center text-muted-foreground"
                >
                  Không tìm thấy chi nhánh nào
                </td>
              </tr>
            ) : (
              branches.map((branch) => (
                <tr
                  key={branch.id}
                  className="hover:bg-muted/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      {branch.imageUrl ? (
                        <img
                          src={branch.imageUrl}
                          alt={branch.hotelBranchName}
                          className="w-12 h-12 rounded-lg object-cover border border-border"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                          <Building className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <div className="font-semibold text-foreground">
                          {branch.hotelBranchName}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                          Thuộc:{" "}
                          <span className="font-medium text-foreground">
                            {branch.hotelName}
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-1.5 max-w-xs">
                      <MapPin className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
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
                    <div className="flex items-center gap-1.5 text-foreground font-medium">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      {branch.capacity}{" "}
                      <span className="text-muted-foreground font-normal">người</span>
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
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onView(branch)}
                        className="text-muted-foreground hover:text-primary hover:bg-primary/10"
                        title="Xem chi tiết"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onViewChats && onViewChats(branch.id)}
                        className="text-muted-foreground hover:text-emerald-500 hover:bg-emerald-50"
                        title="Xem tin nhắn khách hàng"
                      >
                        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"/></svg>
                      </Button>
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onEdit(branch)}
                        className="text-muted-foreground hover:text-amber-500 hover:bg-amber-50"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {branch.status !== BranchStatus.CONFIRMED && (
                        <Button
                          variant="ghost" size="icon"
                          onClick={() => onDelete(branch.id)}
                          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                          title="Xóa chi nhánh"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
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
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-4 bg-muted/50">
          <div>
            Hiển thị{" "}
            <span className="font-medium text-foreground">{branches.length}</span>{" "}
            trên tổng số{" "}
            <span className="font-medium text-foreground">{totalElements}</span>{" "}
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
