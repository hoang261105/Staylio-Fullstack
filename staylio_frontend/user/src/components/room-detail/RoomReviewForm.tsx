/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Star } from "lucide-react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useCreateReviewMutation, useReviews } from "../../../../common/hooks/useReviews";
import { InputField } from "../../../../common/components/InputField";
import { useApiErrors } from "../../../../common/hooks/useApiErrors";
import { useHistoryBookings } from "../../../../common/hooks/useBookings";
import { BookingStatus } from "../../../../common/enums/BookingStatus";
import { useProfile } from "../../../../common/hooks/useProfile";
import type { BookingHistoryResponse } from "../../../../common/interfaces/response/BookingHistoryResponse";
import type { ReviewResponse } from "../../../../common/interfaces/response/ReviewResponse";
import { Button } from "../../../../common/components/ui/button";

interface RoomReviewFormProps {
  roomId: number;
}

export default function RoomReviewForm({ roomId }: RoomReviewFormProps) {
  const { data: user } = useProfile();
  const { t } = useTranslation();

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
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  const { fieldErrors, handleApiErrors, clearAllErrors } =
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

  if (!user || !checkedOutBooking || isLoadingReviews || hasReviewed || isSubmitted) {
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
        } else if (errorData?.code === "TOXIC_COMMENT_DETECTED" || errorData?.message?.includes("ngôn từ không phù hợp")) {
          handleApiErrors([{ message: t("roomDetail.toxicComment") }]);
        } else if (errorData?.message) {
          handleApiErrors([{ message: errorData.message }]);
        } else {
          handleApiErrors([{ message: t("roomDetail.submitReviewError") }]);
        }
      },
      onSuccess: (data: any) => {
        setComment("");
        setRating(5);
        setIsSubmitted(true);
        if (data?.data?.status === 'PENDING') {
          toast.success(t("roomDetail.reviewPending"));
        } else {
          toast.success(t("roomDetail.reviewSuccess"));
        }
      },
    });
  };

  return (
    <div className="bg-card p-6 rounded-2xl shadow-sm border border-border mb-8">
      <h3 className="text-xl font-bold text-foreground mb-4">
        {t("roomDetail.writeReviewTitle")}
      </h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-foreground mb-2">
            {t("roomDetail.ratingLabel")} <span className="text-red-500">*</span>
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
          label={t("roomDetail.commentLabel")}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={t("roomDetail.commentPlaceholder")}
          error={fieldErrors.comment}
          required
        />

        <Button
          type="submit"
          disabled={createReviewMutation.isPending}
          className="mt-2 px-6 py-6 rounded-lg font-semibold transition-colors"
        >
          {createReviewMutation.isPending ? t("roomDetail.submittingReview") : t("roomDetail.submitReview")}
        </Button>
      </form>
    </div>
  );
}
