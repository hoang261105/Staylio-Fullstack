import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { ChevronLeft, Star, UserCircle, MessageSquare } from "lucide-react";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import { useRoomById } from "../../../common/hooks/useRooms";
import { useReviews } from "../../../common/hooks/useReviews";
import type { ReviewResponse } from "../../../common/interfaces/response/ReviewResponse";
import { Button } from "../../../common/components/ui/button";

export default function RoomReviews() {
  const { hotelId, branchId, roomId } = useParams();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: room, isLoading: isLoadingRoom } = useRoomById(Number(roomId));
  const { data: reviewsData, isLoading: isLoadingReviews } = useReviews({
    roomId: Number(roomId),
    page,
    size,
    sortBy: "createdAt",
    direction: "desc",
  });

  const reviews = reviewsData?.items || [];
  const totalPages = reviewsData?.pagination?.totalPages || 0;

  return (
    <div className="min-h-screen bg-background font-sans flex flex-col">
      <Header />
      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 w-full">
        {/* Navigation back */}
        <Link 
          to={`/hotel/${hotelId}/branch/${branchId}/room/${roomId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors mb-8 font-medium"
        >
          <ChevronLeft className="w-5 h-5" />
          Quay lại chi tiết phòng
        </Link>

        {/* Header section */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-8 mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-card-foreground mb-2">Đánh giá khách hàng</h1>
            <p className="text-muted-foreground">Phòng: <span className="font-semibold text-card-foreground">{isLoadingRoom ? "Đang tải..." : room?.roomName}</span></p>
          </div>
          
          <div className="flex items-center gap-4 bg-muted px-6 py-4 rounded-xl border border-border">
            <div className="flex flex-col items-center">
              <span className="text-3xl font-black text-card-foreground">{room?.averageRating?.toFixed(1) || "0.0"}</span>
              <span className="text-sm font-medium text-muted-foreground">/ 5 sao</span>
            </div>
            <div className="w-px h-12 bg-border"></div>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 mb-1 text-yellow-400">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className={`w-5 h-5 ${i <= Math.round(room?.averageRating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`} />
                ))}
              </div>
              <span className="text-sm font-medium text-muted-foreground">{room?.countReview || 0} bài đánh giá</span>
            </div>
          </div>
        </div>

        {/* Reviews List */}
        {isLoadingReviews ? (
           <div className="flex justify-center py-20">
             <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary"></div>
           </div>
        ) : reviews.length === 0 ? (
           <div className="bg-card rounded-2xl p-16 text-center border border-border flex flex-col items-center">
             <MessageSquare className="w-12 h-12 text-muted-foreground mb-4" />
             <h3 className="text-xl font-bold text-card-foreground mb-2">Chưa có đánh giá nào</h3>
             <p className="text-muted-foreground">Phòng này hiện chưa có lượt đánh giá nào từ khách hàng.</p>
           </div>
        ) : (
          <div className="flex flex-col gap-6">
            {reviews.map((review: ReviewResponse) => (
              <div
                key={review.id}
                className="bg-card border border-border p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    {review.avatarUrl ? (
                      <img
                        src={review.avatarUrl}
                        alt={review.fullName}
                        className="w-12 h-12 rounded-full object-cover shadow-sm border border-border"
                      />
                    ) : (
                      <UserCircle className="w-12 h-12 text-muted-foreground" />
                    )}
                    <div>
                      <h4 className="font-bold text-card-foreground text-lg">{review.fullName}</h4>
                      <p className="text-sm text-muted-foreground font-medium">
                        {new Date(review.createdAt).toLocaleDateString("vi-VN", {
                          day: '2-digit', month: '2-digit', year: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 text-yellow-600 bg-yellow-50 px-3 py-1.5 rounded-lg border border-yellow-100">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <span className="text-sm font-bold">{review.rating}</span>
                  </div>
                </div>
                
                <p className="text-card-foreground text-base leading-relaxed whitespace-pre-line mt-2">
                  {review.comment}
                </p>

                {review.replyComment && (
                  <div className="mt-6 bg-primary/5 rounded-xl p-5 border border-primary/10 relative before:content-[''] before:absolute before:-top-2 before:left-8 before:w-4 before:h-4 before:bg-primary/5 before:border-l before:border-t before:border-primary/10 before:rotate-45">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-sm">
                        S
                      </div>
                      <span className="font-bold text-sm text-foreground">
                        Phản hồi từ Staylio
                      </span>
                      <span className="text-xs text-muted-foreground font-medium ml-auto">
                        {new Date(review.replyAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                      {review.replyComment}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-10">
            <Button
              variant="outline"
              disabled={page === 0}
              onClick={() => setPage(p => p - 1)}
            >
              Trang trước
            </Button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }).map((_, i) => (
                <Button
                  key={i}
                  variant={page === i ? "default" : "ghost"}
                  onClick={() => setPage(i)}
                  className="w-10 h-10 p-0"
                >
                  {i + 1}
                </Button>
              ))}
            </div>
            <Button
              variant="outline"
              disabled={page >= totalPages - 1}
              onClick={() => setPage(p => p + 1)}
            >
              Trang sau
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
