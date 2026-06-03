import { Link } from "react-router-dom";
import { Star, UserCircle } from "lucide-react";
import type { ReviewResponse } from "../../../../common/interfaces/response/ReviewResponse";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";

interface RoomReviewsPreviewProps {
  reviews: ReviewResponse[];
  totalItems: number;
  room: RoomResponse;
  hotelId: string | number;
  branchId: string | number;
  roomId: string | number;
}

export default function RoomReviewsPreview({
  reviews,
  totalItems,
  room,
  hotelId,
  branchId,
  roomId,
}: RoomReviewsPreviewProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Đánh giá khách hàng</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-900" />
            <span className="font-bold text-lg">
              {room.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <span className="text-gray-500 font-medium text-sm">
            / 5 ({room.countReview || 0} đánh giá)
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
          <p className="text-gray-500">Phòng này chưa có đánh giá nào.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review: ReviewResponse) => (
            <div
              key={review.id}
              className="bg-white border border-gray-100 p-6 rounded-2xl shadow-sm"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {review.avatarUrl ? (
                    <img
                      src={review.avatarUrl}
                      alt={review.fullName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <UserCircle className="w-10 h-10 text-gray-300" />
                  )}
                  <div>
                    <h4 className="font-bold text-gray-900">{review.fullName}</h4>
                    <p className="text-xs text-gray-400">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-yellow-500" />
                  <span className="text-xs font-bold">{review.rating}</span>
                </div>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.comment}
              </p>

              {review.replyComment && (
                <div className="mt-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">
                      S
                    </div>
                    <span className="font-bold text-sm text-gray-900">
                      Phản hồi từ Staylio
                    </span>
                    <span className="text-xs text-gray-400 ml-auto">
                      {new Date(review.replyAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700">{review.replyComment}</p>
                </div>
              )}
            </div>
          ))}
          {totalItems > 2 && (
            <Link
              to={`/hotel/${hotelId}/branch/${branchId}/room/${roomId}/reviews`}
              className="w-full block text-center py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
            >
              Xem tất cả {totalItems} đánh giá
            </Link>
          )}
        </div>
      )}
    </section>
  );
}
