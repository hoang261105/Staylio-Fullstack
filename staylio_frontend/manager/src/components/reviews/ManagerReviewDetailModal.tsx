import { useState, useEffect } from "react";
import { X, Building2, Star, MessageSquareQuote, Info, Reply, Calendar } from "lucide-react";
import { useReviewById, useReplyCommentMutation } from "@common/hooks/useReviews";
import { InputField } from "@common/components/InputField";
import { useApiErrors } from "@common/hooks/useApiErrors";
import { reviewStatusColors, reviewStatusLabels } from "@common/utils/review.util";
import { formatDateTime } from "@common/utils/date.util";
import toast from "react-hot-toast";

interface ManagerReviewDetailModalProps {
  reviewId: number;
  onClose: () => void;
}

export default function ManagerReviewDetailModal({ reviewId, onClose }: ManagerReviewDetailModalProps) {
  const { data: review, isLoading, isError } = useReviewById(reviewId);
  const { mutate: replyComment, isPending } = useReplyCommentMutation(reviewId);
  const { fieldErrors, handleApiErrors, clearAllErrors, clearFieldError } = useApiErrors();
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (review?.replyComment) {
      setReplyText(review.replyComment);
    }
  }, [review]);

  const handleReplySubmit = () => {
    if (!replyText.trim()) {
      toast.error("Vui lòng nhập nội dung phản hồi!");
      return;
    }

    clearAllErrors();
    replyComment(replyText, {
      onSuccess: () => {
        onClose();
      },
      onError: (error: any) => {
        const serverResponse = error?.response?.data?.errors;
        if (serverResponse) handleApiErrors(serverResponse);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#0066FF]/10 text-[#0066FF] rounded-xl flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900">Chi tiết Đánh giá</h2>
              {!isLoading && review && (
                <p className="text-sm text-gray-500 font-medium">Mã đặt phòng: {review.bookingCode}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 font-medium text-sm">Đang tải thông tin...</p>
            </div>
          ) : isError || !review ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
              <Info className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-medium">Không thể tải chi tiết đánh giá.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Thông tin Đánh giá - Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.fullName)}
                    alt={review.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <div className="font-bold text-gray-900 text-base">{review.fullName}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? "fill-amber-400" : "fill-gray-200 text-gray-200"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 font-medium ml-1 bg-gray-200 px-1.5 py-0.5 rounded">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reviewStatusColors[review.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                    {reviewStatusLabels[review.status] || review.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateTime(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Nội dung đánh giá */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2 text-sm">
                  <MessageSquareQuote className="w-4 h-4 text-gray-500" />
                  Nội dung bình luận
                </div>
                <div className="p-4">
                  <p className="text-gray-800 text-sm whitespace-pre-wrap leading-relaxed">
                    {review.comment || <span className="italic text-gray-400">Khách hàng không để lại bình luận chữ.</span>}
                  </p>
                </div>
              </div>

              {/* Thông tin Khách sạn & Phòng */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-gray-50/80 border-b border-gray-100 font-semibold text-gray-700 flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-gray-500" />
                  Thông tin Dịch vụ
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-4">
                    {review.roomImage ? (
                      <img src={review.roomImage} alt={review.roomName} className="w-16 h-16 object-cover rounded-lg border border-gray-100" />
                    ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <div className="font-semibold text-gray-900 text-base">{review.hotelName}</div>
                      <div className="text-gray-600 flex items-center gap-1.5">
                        Chi nhánh: <span className="font-medium text-gray-800">{review.hotelBranchName}</span>
                      </div>
                      <div className="text-gray-600 flex items-center gap-1.5">
                        Phòng: <span className="font-medium text-gray-800">{review.roomName}</span> - Số: <span className="font-medium text-gray-800">{review.roomNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần Phản hồi */}
              <div className="bg-blue-50/50 rounded-xl border border-blue-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-blue-50/80 border-b border-blue-100 font-semibold text-[#0066FF] flex items-center gap-2 text-sm">
                  <Reply className="w-4 h-4" />
                  Phản hồi từ Khách sạn
                </div>
                <div className="p-4">
                  <InputField
                    label="Nội dung phản hồi"
                    placeholder="Nhập phản hồi gửi đến khách hàng..."
                    value={replyText}
                    onChange={(e) => {
                      setReplyText(e.target.value);
                      clearFieldError("replyComment");
                    }}
                    error={fieldErrors.replyComment}
                  />
                  {review.replyAt && (
                    <div className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                      Đã phản hồi vào lúc: <span className="font-medium">{formatDateTime(review.replyAt)}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors shadow-sm"
          >
            Đóng cửa sổ
          </button>
          {!isLoading && review && (
            <button
              onClick={handleReplySubmit}
              disabled={isPending}
              className="px-5 py-2.5 text-sm font-medium text-white bg-[#0066FF] rounded-xl hover:bg-blue-600 transition-colors shadow-sm disabled:opacity-50 flex items-center gap-2"
            >
              {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {review.replyComment ? "Cập nhật phản hồi" : "Gửi phản hồi"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
