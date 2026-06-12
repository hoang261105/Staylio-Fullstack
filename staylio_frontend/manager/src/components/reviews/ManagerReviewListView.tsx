import { Eye, Star, Hash, Building2, MessageCircle, Reply } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { ReviewResponse } from "@common/interfaces/response/ReviewResponse";
import dayjs from "dayjs";
import { reviewStatusColors, reviewStatusLabels } from "@common/utils/review.util";
import { Button } from "@common/components/ui/button";

interface ManagerReviewListViewProps {
  reviews: ReviewResponse[];
  isLoading: boolean;
  totalElements: number;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onView: (review: ReviewResponse) => void;
}

export default function ManagerReviewListView({
  reviews,
  isLoading,
  totalElements,
  totalPages,
  currentPage,
  onPageChange,
  onView,
}: ManagerReviewListViewProps) {
  return (
    <div className="bg-card text-foreground rounded-2xl border border-border shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-muted-foreground">
          <thead className="bg-muted/80 border-b border-border text-xs uppercase text-foreground font-semibold">
            <tr>
              <th className="px-6 py-4">Đánh giá / Khách hàng</th>
              <th className="px-6 py-4">Chi tiết phòng</th>
              <th className="px-6 py-4">Nội dung đánh giá</th>
              <th className="px-6 py-4">Phản hồi</th>
              <th className="px-6 py-4">Trạng thái</th>
              <th className="px-6 py-4">Thời gian</th>
              <th className="px-6 py-4 text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-muted-foreground">
                  Không tìm thấy đánh giá nào
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-muted/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center shrink-0 border border-primary/20">
                        <Star className="w-5 h-5 fill-primary" />
                        <span className="ml-1 font-bold">{review.rating}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{review.fullName}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Hash className="w-3.5 h-3.5" />
                          <span>{review.bookingCode}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-foreground">
                        <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{review.hotelBranchName}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Phòng: <span className="font-semibold text-foreground">{review.roomName}</span> - Số: <span className="font-semibold text-foreground">{review.roomNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-start gap-1.5 text-sm text-foreground">
                        <MessageCircle className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
                        <span className="line-clamp-2" title={review.comment}>{review.comment || <span className="italic text-muted-foreground">Không có bình luận</span>}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-50">
                    {review.replyComment ? (
                      <div className="space-y-1">
                        <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                          <Reply className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span className="line-clamp-2" title={review.replyComment}>{review.replyComment}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground ml-5.5">
                          {dayjs(review.replyAt).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Chưa phản hồi</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reviewStatusColors[review.status] || "bg-muted text-foreground border-border"}`}>
                      {reviewStatusLabels[review.status] || review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-foreground">
                      {dayjs(review.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {dayjs(review.createdAt).format("HH:mm")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost" size="icon"
                        onClick={() => onView(review)}
                        title="Xem chi tiết & Phản hồi"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {!isLoading && reviews.length > 0 && (
        <div className="p-4 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between text-sm text-muted-foreground gap-4 bg-muted/50">
          <div>
            Hiển thị <span className="font-medium text-foreground">{reviews.length}</span> trên tổng số{" "}
            <span className="font-medium text-foreground">{totalElements}</span> đánh giá
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
