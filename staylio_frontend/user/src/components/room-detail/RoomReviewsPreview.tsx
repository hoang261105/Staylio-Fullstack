import { Link } from "react-router-dom";
import { Star, UserCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { ReviewResponse } from "../../../../common/interfaces/response/ReviewResponse";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { Button } from "../../../../common/components/ui/button";

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
  const { t } = useTranslation();
  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-foreground">{t("roomDetail.customerReviews")}</h2>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-yellow-900" />
            <span className="font-bold text-lg">
              {room.averageRating?.toFixed(1) || "0.0"}
            </span>
          </div>
          <span className="text-muted-foreground font-medium text-sm">
            / 5 ({room.countReview || 0} {t("roomDetail.reviews")})
          </span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <div className="bg-muted rounded-2xl p-8 text-center border border-border">
          <p className="text-muted-foreground">{t("roomDetail.noReviews")}</p>
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {reviews.map((review: ReviewResponse) => (
            <div
              key={review.id}
              className="bg-card border border-border p-6 rounded-2xl shadow-sm"
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
                    <UserCircle className="w-10 h-10 text-muted-foreground" />
                  )}
                  <div>
                    <h4 className="font-bold text-card-foreground">{review.fullName}</h4>
                    <p className="text-xs text-muted-foreground">
                      {new Date(review.createdAt).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-yellow-500 bg-yellow-50 px-2 py-1 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-yellow-500" />
                  <span className="text-xs font-bold">{review.rating}</span>
                </div>
              </div>
              <p className="text-card-foreground text-sm leading-relaxed">
                {review.comment}
              </p>

              {review.replyComment && (
                <div className="mt-4 bg-primary/5 rounded-xl p-4 border border-primary/10">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                      S
                    </div>
                    <span className="font-bold text-sm text-foreground">
                      {t("roomDetail.staylioReply")}
                    </span>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {new Date(review.replyAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <p className="text-sm text-foreground">{review.replyComment}</p>
                </div>
              )}
            </div>
          ))}
          {totalItems > 2 && (
            <Button
              variant="outline"
              asChild
              className="w-full py-6 rounded-xl text-foreground font-semibold"
            >
              <Link to={`/hotel/${hotelId}/branch/${branchId}/room/${roomId}/reviews`}>
                {t("roomDetail.viewAllReviews", { count: totalItems })}
              </Link>
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
