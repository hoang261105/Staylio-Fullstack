import { ReviewStatus } from "@common/enums/ReviewStatus";

export interface ReviewResponse {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    reviewId: number;
    fullName: string;
    avatarUrl: string;
    bookingId: number;
    bookingCode: string;
    roomId: number;
    roomName: string;
    roomImage: string;
    roomNumber: string;
    hotelBranchId: number;
    hotelBranchName: string;
    hotelId: number;
    hotelName: string;
    replyComment: string;
    replyAt: string;
    status: ReviewStatus;
}