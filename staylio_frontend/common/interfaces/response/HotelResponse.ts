import { HotelStatus } from "@common/enums/HotelStatus";

export interface HotelResponse {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    hostHotelName: string;
    status: HotelStatus;
    active: boolean;
}