import { RoomStatus } from "../../enums/RoomStatus";
import { RoomType } from "../../enums/RoomType";
import { UtilityResponse } from "./UtilityResponse";

export interface RoomResponse {
    id: number;
    hotelBranchId: number;
    roomName: string;
    roomType: RoomType;
    description: string;
    hotelBranchName: string;
    price: number;
    maxAdults: number;
    maxChildren: number;
    capacity: number;
    adultPrice: number;
    childPrice: number;
    bedInfo: string;
    area: number;
    roomNumber: string;
    status: RoomStatus;
    isActive: boolean;
    isVoucherApplicable: boolean;
    floor: number;
    utilities: UtilityResponse[];
}