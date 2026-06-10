import { useState } from "react";
import { Ticket, X, Check } from "lucide-react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();

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
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 mb-6">
      <h2 className="text-xl font-bold text-card-foreground mb-6 flex items-center gap-2">
        <Ticket className="w-6 h-6 text-primary" />
        {t("bookingConfirmation.voucherTitle")}
      </h2>

      {isLoading ? (
        <div className="animate-pulse bg-muted h-12 rounded-xl"></div>
      ) : responseData?.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          {t("bookingConfirmation.noVoucher")}
        </p>
      ) : (
        <div
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-background border border-input text-foreground rounded-xl p-3 text-sm font-medium cursor-pointer hover:bg-muted transition-colors flex justify-between items-center"
        >
          {selectedVoucher ? (
            <span className="text-primary font-semibold">
              {t("bookingConfirmation.selected")} {selectedVoucher.code} - {t("bookingConfirmation.discount")}{" "}
              {selectedVoucher.discountType === "PERCENTAGE"
                ? `${selectedVoucher.discountValue}%`
                : `${new Intl.NumberFormat("vi-VN").format(selectedVoucher.discountValue)}đ`}
            </span>
          ) : (
            <span className="text-muted-foreground">{t("bookingConfirmation.selectVoucher")}</span>
          )}
          <Ticket className="w-5 h-5 text-muted-foreground" />
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card rounded-2xl shadow-xl w-full max-w-md max-h-[80vh] flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-lg font-bold text-card-foreground">
                {t("bookingConfirmation.selectVoucherModalTitle")}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-muted-foreground" />
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
                        ? "border-border bg-muted opacity-60 cursor-not-allowed"
                        : isSelected
                          ? "border-primary bg-primary/10 cursor-pointer"
                          : "border-border hover:border-primary/50 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-foreground">
                            {voucher.code}
                          </span>
                          {isUsed && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                              {t("bookingConfirmation.used")}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-primary mb-1">
                          {t("bookingConfirmation.discount")}{" "}
                          {voucher.discountType === "PERCENTAGE"
                            ? `${voucher.discountValue}%`
                            : `${new Intl.NumberFormat("vi-VN").format(voucher.discountValue)}đ`}
                          {voucher.maxDiscountAmount > 0 &&
                            ` ${t("bookingConfirmation.maxDiscount", { max: new Intl.NumberFormat("vi-VN").format(voucher.maxDiscountAmount) })}`}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("bookingConfirmation.minOrder")}{" "}
                          {new Intl.NumberFormat("vi-VN").format(
                            voucher.minOrderValue,
                          )}
                          đ
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {t("bookingConfirmation.expiryDate")}{" "}
                          {new Date(voucher.expiryDate).toLocaleDateString(
                            "vi-VN",
                          )}
                        </p>
                      </div>
                      {!isUsed && (
                        <div
                          className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-1 ${
                            isSelected
                              ? "border-primary bg-primary"
                              : "border-border"
                          }`}
                        >
                          {isSelected && (
                            <Check className="w-3 h-3 text-primary-foreground" />
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
