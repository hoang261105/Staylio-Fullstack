import { useState } from "react";
import { Star } from "lucide-react";
import { useCreateReviewMutation, useReviews } from "../../../../common/hooks/useReviews";
import { InputField } from "../../../../common/components/InputField";
import { useApiErrors } from "../../../../common/hooks/useApiErrors";
import { useHistoryBookings } from "../../../../common/hooks/useBookings";
import { BookingStatus } from "../../../../common/enums/BookingStatus";
import { useProfile } from "../../../../common/hooks/useProfile";
import type { BookingHistoryResponse } from "../../../../common/interfaces/response/BookingHistoryResponse";
import type { ReviewResponse } from "../../../../common/interfaces/response/ReviewResponse";

interface RoomReviewFormProps {
  roomId: number;
}

export default function RoomReviewForm({ roomId }: RoomReviewFormProps) {
  const { data: user } = useProfile();

  const { data: historyBookings } = useHistoryBookings({
    status: BookingStatus.CHECKED_OUT,
    page: 0,
    size: 50,
  });

  const { data: userReviews, isLoading: isLoadingReviews } = useReviews({
    userId: user?.id,
    roomId,
    page: 0,
    size: 50,
  });

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>("");

  const { fieldErrors, formError, handleApiErrors, clearAllErrors } =
    useApiErrors();

  const checkedOutBooking = historyBookings?.items?.find(
    (booking: BookingHistoryResponse) => booking.roomId === roomId && booking.status === BookingStatus.CHECKED_OUT
  );

  const hasReviewed = userReviews?.items?.some(
    (review: ReviewResponse) => review.bookingId === checkedOutBooking?.bookingId
  );

  const createReviewMutation = useCreateReviewMutation({
    bookingId: checkedOutBooking?.bookingId || 0,
    roomId,
    rating,
    comment,
  });

  if (!user || !checkedOutBooking || isLoadingReviews || hasReviewed) {
    return null;
  }

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    createReviewMutation.mutate(undefined, {
      onError: (err: any) => {
        const errorData = err.response?.data;
        if (errorData?.errors) {
          handleApiErrors(errorData.errors);
        } else if (errorData?.message) {
          handleApiErrors([{ message: errorData.message }]);
        } else {
          handleApiErrors([{ message: "Đã có lỗi xảy ra khi gửi đánh giá." }]);
        }
      },
      onSuccess: () => {
        setComment("");
        setRating(5);
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 mb-8">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Đánh giá trải nghiệm của bạn
      </h3>
      <form onSubmit={handleSubmit}>
        {formError && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
            {formError}
          </div>
        )}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Đánh giá sao <span className="text-red-500">*</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${star <= rating
                    ? "fill-yellow-400 text-yellow-500"
                    : "text-gray-300"
                    } hover:scale-110 transition-transform`}
                />
              </button>
            ))}
          </div>
        </div>

        <InputField
          label="Bình luận của bạn"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Chia sẻ trải nghiệm của bạn về phòng này..."
          error={fieldErrors.comment}
          required
        />

        <button
          type="submit"
          disabled={createReviewMutation.isPending}
          className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 transition-colors"
        >
          {createReviewMutation.isPending ? "Đang gửi..." : "Gửi đánh giá"}
        </button>
      </form>
    </div>
  );
}
