import { useState } from "react";
import { Ticket, X, Check } from "lucide-react";
import { useVoucherApplicable } from "../../../../common/hooks/useVouchers";
import type { ApplicableVoucherResponse } from "../../../../common/interfaces/response/ApplicableVoucherResponse";

interface VoucherSelectorProps {
  selectedVoucherId: number | null;
  onSelectVoucher: (id: number | null) => void;
  roomId: number;
  checkInDate: string;
  checkOutDate: string;
}

export const VoucherSelector = ({
  selectedVoucherId,
  onSelectVoucher,
  roomId,
  checkInDate,
  checkOutDate,
}: VoucherSelectorProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: responseData, isLoading } = useVoucherApplicable({
    roomId,
    checkInDate,
    checkOutDate,
  });

  const selectedVoucher = responseData?.find(
    (v: ApplicableVoucherResponse) => v.userVoucherId === selectedVoucherId,
  );

  const handleSelect = (userVoucherId: number, isUsed: boolean) => {
    if (isUsed) return;
    onSelectVoucher(userVoucherId === selectedVoucherId ? null : userVoucherId);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
        <Ticket className="w-6 h-6 text-blue-600" />
        Mã giảm giá
      </h2>

      {isLoading ? (
        <div className="animate-pulse bg-gray-100 h-12 rounded-xl"></div>
      ) : responseData?.length === 0 ? (
        <p className="text-sm text-gray-500">
          Bạn chưa có mã giảm giá nào có thể áp dụng cho phòng này.
        </p>
      ) : (
        <div
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl p-3 text-sm font-medium cursor-pointer hover:bg-gray-100 transition-colors flex justify-between items-center"
        >
          {selectedVoucher ? (
            <span className="text-blue-600 font-semibold">
              Đã chọn: {selectedVoucher.code} - Giảm{" "}
              {selectedVoucher.discountType === "PERCENTAGE"
                ? `${selectedVoucher.discountValue}%`
                : `${new Intl.NumberFormat("vi-VN").format(selectedVoucher.discountValue)}đ`}
            </span>
          ) : (
            <span className="text-gray-500">Chọn hoặc nhập mã giảm giá</span>
          )}
          <Ticket className="w-5 h-5 text-gray-400" />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">
                Chọn mã giảm giá
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {responseData?.map((voucher: ApplicableVoucherResponse) => {
                const isSelected = selectedVoucherId === voucher.userVoucherId;
                const isUsed = voucher.isUsed;

                return (
                  <div
                    key={voucher.userVoucherId}
                    onClick={() => handleSelect(voucher.userVoucherId, isUsed)}
                    className={`relative border rounded-xl p-4 transition-all ${
                      isUsed
                        ? "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
                        : isSelected
                          ? "border-blue-500 bg-blue-50 cursor-pointer"
                          : "border-gray-200 hover:border-blue-300 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-gray-900">
                            {voucher.code}
                          </span>
                          {isUsed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                              Đã sử dụng
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-blue-600 mb-1">
                          Giảm{" "}
                          {voucher.discountType === "PERCENTAGE"
                            ? `${voucher.discountValue}%`
                            : `${new Intl.NumberFormat("vi-VN").format(voucher.discountValue)}đ`}
                          {voucher.maxDiscountAmount > 0 &&
                            ` (Tối đa ${new Intl.NumberFormat("vi-VN").format(voucher.maxDiscountAmount)}đ)`}
                        </p>
                        <p className="text-xs text-gray-500">
                          Đơn tối thiểu:{" "}
                          {new Intl.NumberFormat("vi-VN").format(
                            voucher.minOrderValue,
                          )}
                          đ
                        </p>
                        <p className="text-xs text-gray-500">
                          HSD:{" "}
                          {new Date(voucher.expiryDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      {!isUsed && (
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
