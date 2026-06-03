import { RoomStatus } from "@common/enums/RoomStatus";

export interface SearchRoomRequest {
    keyword: string;
    checkInDate: string;
    checkOutDate: string;
    status: RoomStatus;
    adults: number;
    children: number;
    capacity: number;
    page: number;
    size: number;
    minPrice: number;
    maxPrice: number;
    minRating: number;
    sortBy: string;
    direction: string;
}