import { RoomType } from "@common/enums/RoomType";

export interface RoomRequest {
    roomName: string;
    roomType: RoomType;
    description: string;
    hotelBranchId: number;
    price: number;
    maxAdults: number;
    maxChildren: number;
    capacity: number;
    adultPrice: number;
    childPrice: number;
    bedInfo: string;
    area: number;
    roomNumber: string;
    floor: number;
    utilityIds: number[];
    imageUrls: string[];
    vr360Urls?: string[];
}