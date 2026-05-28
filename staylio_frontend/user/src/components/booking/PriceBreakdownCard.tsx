import { Receipt, Loader2, ArrowRight } from "lucide-react";
import type { BookingPreviewResponse } from "../../../../common/interfaces/response/BookingPreviewResponse";

interface PriceBreakdownCardProps {
    previewData?: BookingPreviewResponse;
    isLoadingPreview: boolean;
    isSubmitting: boolean;
    onSubmit: () => void;
}

export const PriceBreakdownCard = ({ previewData, isLoadingPreview, isSubmitting, onSubmit }: PriceBreakdownCardProps) => {
    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden sticky top-28">
            <div className="bg-blue-600 p-6 text-white flex items-center gap-2">
                <Receipt className="w-6 h-6" />
                <h2 className="text-xl font-bold">Chi tiết thanh toán</h2>
            </div>

            <div className="p-6">
                {isLoadingPreview ? (
                    <div className="space-y-4 animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="h-4 bg-gray-200 rounded w-full"></div>
                        <div className="h-px bg-gray-200 my-4"></div>
                        <div className="h-6 bg-gray-200 rounded w-full"></div>
                    </div>
                ) : previewData ? (
                    <div className="space-y-4 text-sm font-medium text-gray-700">
                        <div className="flex justify-between items-center">
                            <span>Giá mỗi đêm</span>
                            <span className="font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(previewData.pricePerNight)}đ</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Số đêm</span>
                            <span className="font-bold text-gray-900">{previewData.nights}</span>
                        </div>
                        <div className="h-px bg-gray-100 my-2"></div>
                        <div className="flex justify-between items-center">
                            <span>Tạm tính</span>
                            <span className="font-bold text-gray-900">{new Intl.NumberFormat('vi-VN').format(previewData.originalPrice)}đ</span>
                        </div>

                        {previewData.discountAmount > 0 && (
                            <div className="flex justify-between items-center text-green-600">
                                <span>Giảm giá Voucher</span>
                                <span className="font-bold">- {new Intl.NumberFormat('vi-VN').format(previewData.discountAmount)}đ</span>
                            </div>
                        )}

                        <div className="h-px bg-gray-100 my-4"></div>

                        <div className="flex justify-between items-center">
                            <span className="text-base font-bold text-gray-900">Tổng thanh toán</span>
                            <span className="text-2xl font-bold text-blue-600">{new Intl.NumberFormat('vi-VN').format(previewData.finalPrice)}đ</span>
                        </div>
                        <div className="text-right text-xs text-gray-500 font-normal">Đã bao gồm thuế và phí</div>
                    </div>
                ) : (
                    <div className="text-sm text-gray-500 text-center py-4">Vui lòng điền đầy đủ thông tin để xem giá</div>
                )}

                <button
                    onClick={onSubmit}
                    disabled={isSubmitting || isLoadingPreview || !previewData}
                    className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang xử lý...
                        </>
                    ) : (
                        <>
                            Xác nhận đặt phòng
                            <ArrowRight className="w-5 h-5" />
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};
