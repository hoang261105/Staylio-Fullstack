export interface ReviewRequest {
    bookingId: number;
    roomId: number;
    rating: number;
    comment: string;
}