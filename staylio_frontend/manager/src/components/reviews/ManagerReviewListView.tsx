import { Eye, Star, Hash, Building2, MessageCircle, Reply } from "lucide-react";
import Pagination from "../../../../common/components/Pagination";
import type { ReviewResponse } from "@common/interfaces/response/ReviewResponse";
import dayjs from "dayjs";
import { reviewStatusColors, reviewStatusLabels } from "@common/utils/review.util";

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
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50/80 border-b border-gray-100 text-xs uppercase text-gray-700 font-semibold">
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
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
                    <span>Đang tải dữ liệu...</span>
                  </div>
                </td>
              </tr>
            ) : reviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  Không tìm thấy đánh giá nào
                </td>
              </tr>
            ) : (
              reviews.map((review) => (
                <tr key={review.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-50 text-[#0066FF] rounded-lg flex items-center justify-center shrink-0 border border-blue-100">
                        <Star className="w-5 h-5 fill-[#0066FF]" />
                        <span className="ml-1 font-bold">{review.rating}</span>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{review.fullName}</div>
                        <div className="mt-0.5 flex items-center gap-1.5 text-xs text-gray-500">
                          <Hash className="w-3.5 h-3.5" />
                          <span>{review.bookingCode}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 font-medium text-gray-900">
                        <Building2 className="w-3.5 h-3.5 text-gray-400" />
                        <span>{review.hotelBranchName}</span>
                      </div>
                      <div className="text-xs text-gray-500">
                        Phòng: <span className="font-semibold text-gray-700">{review.roomName}</span> - Số: <span className="font-semibold text-gray-700">{review.roomNumber}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-50">
                    <div className="space-y-1">
                      <div className="flex items-start gap-1.5 text-sm text-gray-700">
                        <MessageCircle className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
                        <span className="line-clamp-2" title={review.comment}>{review.comment || <span className="italic text-gray-400">Không có bình luận</span>}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 max-w-50">
                    {review.replyComment ? (
                      <div className="space-y-1">
                        <div className="flex items-start gap-1.5 text-sm text-gray-600">
                          <Reply className="w-4 h-4 text-[#0066FF] mt-0.5 shrink-0" />
                          <span className="line-clamp-2" title={review.replyComment}>{review.replyComment}</span>
                        </div>
                        <div className="text-[10px] text-gray-400 ml-5.5">
                          {dayjs(review.replyAt).format("DD/MM/YYYY HH:mm")}
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Chưa phản hồi</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${reviewStatusColors[review.status] || "bg-gray-50 text-gray-700 border-gray-200"}`}>
                      {reviewStatusLabels[review.status] || review.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {dayjs(review.createdAt).format("DD/MM/YYYY")}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {dayjs(review.createdAt).format("HH:mm")}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onView(review)}
                        title="Xem chi tiết & Phản hồi"
                        className="p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors border border-transparent hover:border-gray-200"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
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
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between text-sm text-gray-500 gap-4 bg-gray-50/50">
          <div>
            Hiển thị <span className="font-medium text-gray-900">{reviews.length}</span> trên tổng số{" "}
            <span className="font-medium text-gray-900">{totalElements}</span> đánh giá
          </div>
          <Pagination page={currentPage} totalPages={totalPages} onChange={onPageChange} />
        </div>
      )}
    </div>
  );
}
