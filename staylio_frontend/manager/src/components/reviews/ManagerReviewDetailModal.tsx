/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { X, Building2, Star, MessageSquareQuote, Info, Reply, Calendar } from "lucide-react";
import { useReviewById, useReplyCommentMutation } from "@common/hooks/useReviews";
import { InputField } from "@common/components/InputField";
import { useApiErrors } from "@common/hooks/useApiErrors";
import { reviewStatusColors, reviewStatusLabels } from "@common/utils/review.util";
import { formatDateTime } from "@common/utils/date.util";
import toast from "react-hot-toast";
import { Button } from "@common/components/ui/button";

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
      <div className="bg-card text-foreground rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">

        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">
              <MessageSquareQuote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Chi tiết Đánh giá</h2>
              {!isLoading && review && (
                <p className="text-sm text-muted-foreground font-medium">Mã đặt phòng: {review.bookingCode}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost" size="icon"
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-muted-foreground font-medium text-sm">Đang tải thông tin...</p>
            </div>
          ) : isError || !review ? (
            <div className="flex flex-col items-center justify-center py-20 text-red-500">
              <Info className="w-12 h-12 mb-3 opacity-50" />
              <p className="font-medium">Không thể tải chi tiết đánh giá.</p>
            </div>
          ) : (
            <div className="space-y-6">

              {/* Thông tin Đánh giá - Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-muted/30 p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <img
                    src={review.avatarUrl || "https://ui-avatars.com/api/?name=" + encodeURIComponent(review.fullName)}
                    alt={review.fullName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-background shadow-sm"
                  />
                  <div>
                    <div className="font-bold text-foreground text-base">{review.fullName}</div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="flex items-center text-amber-400">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <Star key={idx} className={`w-4 h-4 ${idx < review.rating ? "fill-amber-400" : "fill-muted text-muted"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-muted-foreground font-medium ml-1 bg-muted px-1.5 py-0.5 rounded">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reviewStatusColors[review.status] || "bg-muted text-foreground border-border"}`}>
                    {reviewStatusLabels[review.status] || review.status}
                  </span>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDateTime(review.createdAt)}
                  </div>
                </div>
              </div>

              {/* Nội dung đánh giá */}
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border font-semibold text-foreground flex items-center gap-2 text-sm">
                  <MessageSquareQuote className="w-4 h-4 text-muted-foreground" />
                  Nội dung bình luận
                </div>
                <div className="p-4">
                  <p className="text-foreground text-sm whitespace-pre-wrap leading-relaxed">
                    {review.comment || <span className="italic text-muted-foreground">Khách hàng không để lại bình luận chữ.</span>}
                  </p>
                </div>
              </div>

              {/* Thông tin Khách sạn & Phòng */}
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-muted/50 border-b border-border font-semibold text-foreground flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  Thông tin Dịch vụ
                </div>
                <div className="p-4 space-y-3 text-sm">
                  <div className="flex items-start gap-4">
                    {review.roomImage ? (
                      <img src={review.roomImage} alt={review.roomName} className="w-16 h-16 object-cover rounded-lg border border-border" />
                    ) : (
                      <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">
                        <Building2 className="w-6 h-6" />
                      </div>
                    )}
                    <div className="flex-1 space-y-1.5">
                      <div className="font-semibold text-foreground text-base">{review.hotelName}</div>
                      <div className="text-muted-foreground flex items-center gap-1.5">
                        Chi nhánh: <span className="font-medium text-foreground">{review.hotelBranchName}</span>
                      </div>
                      <div className="text-muted-foreground flex items-center gap-1.5">
                        Phòng: <span className="font-medium text-foreground">{review.roomName}</span> - Số: <span className="font-medium text-foreground">{review.roomNumber}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phần Phản hồi */}
              <div className="bg-primary/5 rounded-xl border border-primary/20 shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-primary/10 border-b border-primary/20 font-semibold text-primary flex items-center gap-2 text-sm">
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
                    <div className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      Đã phản hồi vào lúc: <span className="font-medium">{formatDateTime(review.replyAt)}</span>
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Đóng cửa sổ
          </Button>
          {!isLoading && review && (
            <Button
              onClick={handleReplySubmit}
              disabled={isPending}
            >
              {isPending && <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              {review.replyComment ? "Cập nhật phản hồi" : "Gửi phản hồi"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
