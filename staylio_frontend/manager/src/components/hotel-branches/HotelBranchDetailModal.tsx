import { X, MapPin, Building, Users, Image as ImageIcon, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import { BranchStatus } from "@common/enums/BranchStatus";

interface HotelBranchDetailModalProps {
  branch: HotelBranchResponse;
  onClose: () => void;
}

const getStatusConfig = (status: BranchStatus) => {
  switch (status) {
    case BranchStatus.CONFIRMED:
      return { label: "Đã duyệt", color: "text-green-700 bg-green-50 border-green-200", icon: CheckCircle2 };
    case BranchStatus.PENDING:
      return { label: "Đang chờ duyệt", color: "text-yellow-700 bg-yellow-50 border-yellow-200", icon: Clock };
    case BranchStatus.REJECTED:
      return { label: "Từ chối", color: "text-red-700 bg-red-50 border-red-200", icon: XCircle };
    case BranchStatus.DELETED:
      return { label: "Đã xóa", color: "text-gray-700 bg-gray-50 border-gray-200", icon: XCircle };
    default:
      return { label: status, color: "text-gray-700 bg-gray-50 border-gray-200", icon: Clock };
  }
};

interface InfoRowProps {
  label: string;
  value: React.ReactNode;
}

function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
      <span className="text-sm font-medium text-gray-900">{value}</span>
    </div>
  );
}

export default function HotelBranchDetailModal({ branch, onClose }: HotelBranchDetailModalProps) {
  const statusConfig = getStatusConfig(branch.status);
  const StatusIcon = statusConfig.icon;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50 sticky top-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Chi tiết chi nhánh</h2>
            <p className="text-sm text-gray-500 mt-1">Thông tin đầy đủ của chi nhánh</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1">
          {/* Image */}
          <div className="relative w-full h-52 bg-gray-100">
            {branch.imageUrl ? (
              <img
                src={branch.imageUrl}
                alt={branch.hotelBranchName}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
                <ImageIcon className="w-12 h-12 opacity-30" />
                <span className="text-sm">Chưa có hình ảnh</span>
              </div>
            )}
            {/* Status badge overlay */}
            <div className="absolute top-4 right-4">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm ${statusConfig.color}`}>
                <StatusIcon className="w-3.5 h-3.5" />
                {statusConfig.label}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Title block */}
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{branch.hotelBranchName}</h3>
              <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                <Building className="w-4 h-4 text-gray-400" />
                Thuộc thương hiệu:
                <span className="font-semibold text-[#0066FF]">{branch.hotelName}</span>
              </div>
            </div>

            <hr className="border-gray-100" />

            {/* Details grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <InfoRow
                label="Địa chỉ"
                value={
                  <span className="flex items-start gap-1.5">
                    <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                    {branch.address}
                  </span>
                }
              />
              <InfoRow
                label="Phường / Xã"
                value={branch.wardName}
              />
              <InfoRow
                label="Tỉnh / Thành phố"
                value={branch.provinceName}
              />
              <InfoRow
                label="Sức chứa"
                value={
                  <span className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-gray-400" />
                    {branch.capacity} người
                  </span>
                }
              />
              <InfoRow
                label="Địa chỉ đầy đủ"
                value={`${branch.address}, ${branch.wardName}, ${branch.provinceName}`}
              />
              <InfoRow
                label="Số điện thoại"
                value={branch.phone || "Chưa cập nhật"}
              />
              <InfoRow
                label="Mô tả"
                value={branch.description || "Chưa có mô tả"}
              />
              <InfoRow
                label="Trạng thái duyệt"
                value={
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusConfig.color}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {statusConfig.label}
                  </span>
                }
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
