import { X, Tag, Info, Calendar, MapPin, Percent, Coins, ShoppingCart, Users, FileText } from "lucide-react";
import type { VoucherResponse } from "../../../../common/interfaces/response/VoucherResponse";
import { VoucherStatus } from "../../../../common/enums/VoucherStatus";
import { DiscountType } from "../../../../common/enums/DiscountType";
import { Button } from "../../../../common/components/ui/button";

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
      <div className="bg-card text-foreground rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Tag className="w-5 h-5 text-orange-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">Chi tiết Voucher</h2>
              <p className="text-sm text-muted-foreground">Mã: <span className="font-semibold text-foreground">{voucher.code}</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-muted/30">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Column - General Info */}
            <div className="w-full md:w-1/3 space-y-6 shrink-0">
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{voucher.title}</h3>
                    {voucher.hotelBranchName && (
                      <div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
                        <MapPin className="w-4 h-4 shrink-0" />
                        <span className="truncate" title={voucher.hotelBranchName}>
                          {voucher.hotelBranchName}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[voucher.status] || "bg-muted text-muted-foreground border-border"}`}>
                      {statusLabels[voucher.status] || voucher.status}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                      Mã: {voucher.code}
                    </span>
                    {voucher.isWelcomeVoucher && (
                      <span className="inline-flex px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                        Voucher Tân thủ
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date Info */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm space-y-4">
                <h4 className="font-semibold text-foreground flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-primary" />
                  Thời gian áp dụng
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center pb-3 border-b border-border">
                    <span className="text-sm text-muted-foreground">Bắt đầu:</span>
                    <span className="font-medium text-foreground">
                      {new Date(voucher.startDate).toLocaleString('vi-VN')}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Kết thúc (Hết hạn):</span>
                    <span className="font-medium text-foreground">
                      {new Date(voucher.expiryDate).toLocaleString('vi-VN')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Details */}
            <div className="w-full md:w-2/3 space-y-6">
              {/* Discount Grid */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-4 pb-3 border-b border-border">Chi tiết khuyến mãi</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      {voucher.discountType === DiscountType.PERCENTAGE ? (
                        <Percent className="w-5 h-5 text-orange-500" />
                      ) : (
                        <Coins className="w-5 h-5 text-orange-500" />
                      )}
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Mức giảm giá</div>
                      <div className="text-sm font-semibold text-orange-600">
                        {voucher.discountType === DiscountType.PERCENTAGE
                          ? `${voucher.discountValue}%`
                          : `${voucher.discountValue.toLocaleString("vi-VN")} ₫`}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      <ShoppingCart className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Đơn hàng tối thiểu</div>
                      <div className="text-sm font-semibold text-foreground">
                        {voucher.minOrderValue > 0 ? `${voucher.minOrderValue.toLocaleString("vi-VN")} ₫` : "Không yêu cầu"}
                      </div>
                    </div>
                  </div>

                  {voucher.discountType === DiscountType.PERCENTAGE && voucher.maxDiscountAmount > 0 && (
                    <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                      <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                        <Tag className="w-5 h-5 text-green-500" />
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground font-medium mb-0.5">Giảm tối đa</div>
                        <div className="text-sm font-semibold text-foreground">
                          {voucher.maxDiscountAmount.toLocaleString("vi-VN")} ₫
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="p-3 rounded-lg bg-muted border border-border flex items-start gap-3">
                    <div className="bg-card p-2 rounded-md shadow-sm shrink-0">
                      <Users className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground font-medium mb-0.5">Giới hạn mỗi khách</div>
                      <div className="text-sm font-semibold text-foreground">
                        {voucher.usageLimitPerUser} lần
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Usage Progress */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-4 pb-3 border-b border-border flex items-center gap-2">
                  <Info className="w-4 h-4 text-muted-foreground" />
                  Tiến độ sử dụng
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span className="text-muted-foreground">Đã sử dụng</span>
                    <span className="text-foreground">{voucher.currentUsageCount} / {voucher.totalUsageLimit}</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.min((voucher.currentUsageCount / (voucher.totalUsageLimit || 1)) * 100, 100)}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-muted-foreground text-right mt-1">
                    Còn lại {Math.max(voucher.totalUsageLimit - voucher.currentUsageCount, 0)} lượt
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-card rounded-xl border border-border p-5 shadow-sm">
                <h4 className="font-semibold text-foreground mb-3 pb-3 border-b border-border flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  Mô tả chi tiết
                </h4>
                {voucher.description ? (
                  <div className="text-sm text-foreground whitespace-pre-wrap leading-relaxed bg-muted/50 p-4 rounded-lg border border-border">
                    {voucher.description}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground italic text-center py-6 bg-muted/50 rounded-lg border border-border">
                    Voucher này chưa có mô tả chi tiết
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-border bg-muted/50 flex justify-end shrink-0">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Đóng
          </Button>
        </div>
      </div>
    </div>
  );
}
