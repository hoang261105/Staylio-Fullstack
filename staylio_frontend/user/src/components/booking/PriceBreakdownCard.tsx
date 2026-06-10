import { Receipt, Loader2, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BookingPreviewResponse } from "../../../../common/interfaces/response/BookingPreviewResponse";
import { Button } from "../../../../common/components/ui/button";

interface PriceBreakdownCardProps {
    previewData?: BookingPreviewResponse;
    isLoadingPreview: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export const PriceBreakdownCard = ({ previewData, isLoadingPreview, isSubmitting, onSubmit }: PriceBreakdownCardProps) => {
    const { t } = useTranslation();
    return (
        <div className="bg-card rounded-2xl shadow-sm border border-border overflow-hidden sticky top-28">
            <div className="bg-primary p-6 text-primary-foreground flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                <h2 className="text-xl font-bold">{t("bookingConfirmation.priceBreakdownTitle")}</h2>
            </div>

            <div className="p-6">
                {isLoadingPreview ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-muted rounded w-3/4"></div>
                        <div className="h-4 bg-muted rounded w-1/2"></div>
                        <div className="h-4 bg-muted rounded w-full"></div>
                        <div className="h-px bg-muted my-4"></div>
                        <div className="h-6 bg-muted rounded w-full"></div>
                    </div>
                ) : previewData ? (
                    <div className="space-y-4 text-sm font-medium text-muted-foreground">
                        <div className="flex justify-between items-center">
                            <span>{t("bookingConfirmation.pricePerNight")}</span>
                            <span className="font-bold text-foreground">{new Intl.NumberFormat('vi-VN').format(previewData.pricePerNight)}đ</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>{t("bookingConfirmation.numberOfNights")}</span>
                            <span className="font-bold text-foreground">{previewData.nights}</span>
                        </div>
                        <div className="h-px bg-border my-2"></div>
                        <div className="flex justify-between items-center">
                            <span>{t("bookingConfirmation.subtotal")}</span>
                            <span className="font-bold text-foreground">{new Intl.NumberFormat('vi-VN').format(previewData.originalPrice)}đ</span>
                        </div>

                        {previewData.discountAmount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                                <span>{t("bookingConfirmation.voucherDiscount")}</span>
                                <span className="font-bold">- {new Intl.NumberFormat('vi-VN').format(previewData.discountAmount)}đ</span>
                            </div>
                        )}

                        <div className="h-px bg-border my-4"></div>

                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-foreground">{t("bookingConfirmation.totalPayment")}</span>
                            <span className="text-2xl font-bold text-primary">{new Intl.NumberFormat('vi-VN').format(previewData.finalPrice)}đ</span>
                        </div>
                        <div className="text-right text-xs text-muted-foreground font-normal">{t("bookingConfirmation.includesTaxes")}</div>
                    </div>
                ) : (
                    <div className="text-sm text-muted-foreground text-center py-4">{t("bookingConfirmation.fillInfo")}</div>
                )}

                <Button
                    onClick={onSubmit}
                    disabled={isSubmitting || isLoadingPreview || !previewData}
                    className="w-full mt-6 py-6 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            {t("bookingConfirmation.processing")}
                        </>
                    ) : (
                        <>
                            {t("bookingConfirmation.confirmBooking")}
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};
