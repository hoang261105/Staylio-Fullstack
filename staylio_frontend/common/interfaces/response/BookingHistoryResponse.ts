import { BookingStatus } from "@common/enums/BookingStatus";

export interface BookingHistoryResponse {
    bookingId: number;
    bookingCode: number;
    roomId: number;
    roomName: string;
    imageUrl: string;
    hotelName: string;
    hotelBranchName: string;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    finalPrice: number;
    status: BookingStatus;
    createdAt: string;
    paymentMethod?: string;
    paymentUrl?: string;
}