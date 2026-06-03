import { RoomStatus } from "@common/enums/RoomStatus";
import { RoomType } from "@common/enums/RoomType";

export interface RoomSearchResponse {
    roomId: number;
    roomName: string;
    roomType: RoomType;
    images: string[];
    hotelId: number;
    hotelName: string;
    hotelBranchId: number;
    hotelBranchName: string;
    address: string;
    provinceName: string;
    capacity: number;
    maxAdults: number;
    maxChildren: number;
    price: number;
    averageRating: number;
    countReview: number;
    status: RoomStatus
}