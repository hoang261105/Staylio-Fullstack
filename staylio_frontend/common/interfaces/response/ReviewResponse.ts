import { ReviewStatus } from "@common/enums/ReviewStatus";

export interface ReviewResponse {
    id: number;
    rating: number;
    comment: string;
    createdAt: string;
    userId: number;
    fullName: string;
    avatarUrl: string;
    bookingId: number;
    bookingCode: string;
    roomId: number;
    roomName: number;
    roomImage: string;
    roomNumber: string;
    hotelBranchId: number;
    hotelBranchName: string;
    hotelName: string;
    replyComment: string;
    replyAt: string;
    status: ReviewStatus;
}