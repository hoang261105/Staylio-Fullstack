import { X, Tag, Info, Calendar, MapPin, Percent, Coins, ShoppingCart, Users, FileText } from "lucide-react";
import type { VoucherResponse } from "../../../../common/interfaces/response/VoucherResponse";
import { VoucherStatus } from "../../../../common/enums/VoucherStatus";
import { DiscountType } from "../../../../common/enums/DiscountType";

interface VoucherDetailModalProps {
  voucher: VoucherResponse | null;
  onClose: () => void;
}

export default function VoucherDetailModal({ voucher, onClose }: VoucherDetailModalProps) {
  if (!voucher) return null;

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

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Chi tiết Voucher</h2>
              <p className="text-sm text-gray-500">Mã: <span className="font-semibold text-gray-700">{voucher.code}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - General Info */}
            <div className="w-full md:w-1/3 space-y-6 shrink-0">
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{voucher.title}</h3>
                    {voucher.hotelBranchName && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate" title={voucher.hotelBranchName}>
                          {voucher.hotelBranchName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[voucher.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {statusLabels[voucher.status] || voucher.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200">
                      Mã: {voucher.code}
                    </span>
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm space-y-4">
                <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#0066FF]" />
                  Thời gian áp dụng
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-gray-50">
                    <span className="text-sm text-gray-500">Bắt đầu:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(voucher.startDate).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Kết thúc (Hết hạn):</span>
                    <span className="font-medium text-gray-900">
                      {new Date(voucher.expiryDate).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Discount Grid */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-50">Chi tiết khuyến mãi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      {voucher.discountType === DiscountType.PERCENTAGE ? (
                        <Percent className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Coins className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Mức giảm giá</div>
                      <div className="text-sm font-semibold text-orange-600">
                        {voucher.discountType === DiscountType.PERCENTAGE
                          ? `${voucher.discountValue}%`
                          : `${voucher.discountValue.toLocaleString("vi-VN")} ₫`}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      <ShoppingCart className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Đơn hàng tối thiểu</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {voucher.minOrderValue > 0 ? `${voucher.minOrderValue.toLocaleString("vi-VN")} ₫` : "Không yêu cầu"}
                      </div>
                    </div>
                  </div>

                  {voucher.discountType === DiscountType.PERCENTAGE && voucher.maxDiscountAmount > 0 && (
                    <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                      <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                        <Tag className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-0.5">Giảm tối đa</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {voucher.maxDiscountAmount.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="bg-white p-2 rounded-md shadow-sm shrink-0">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 font-medium mb-0.5">Giới hạn mỗi khách</div>
                      <div className="text-sm font-semibold text-gray-900">
                        {voucher.usageLimitPerUser} lần
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-4 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <Info className="w-4 h-4 text-gray-500" />
                  Tiến độ sử dụng
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-gray-600">Đã sử dụng</span>
                    <span className="text-gray-900">{voucher.currentUsageCount} / {voucher.totalUsageLimit}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0066FF] h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((voucher.currentUsageCount / (voucher.totalUsageLimit || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 text-right mt-1">
                    Còn lại {Math.max(voucher.totalUsageLimit - voucher.currentUsageCount, 0)} lượt
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
                <h4 className="font-semibold text-gray-900 mb-3 pb-3 border-b border-gray-50 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-gray-500" />
                  Mô tả chi tiết
                </h4>
                {voucher.description ? (
                  <div className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed bg-gray-50/50 p-4 rounded-lg border border-gray-50">
                    {voucher.description}
                  </div>
                ) : (
                  <div className="text-sm text-gray-400 italic text-center py-6 bg-gray-50/50 rounded-lg border border-gray-50">
                    Voucher này chưa có mô tả chi tiết
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-sm font-medium border border-gray-200 text-gray-700 bg-white rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors shadow-sm"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
