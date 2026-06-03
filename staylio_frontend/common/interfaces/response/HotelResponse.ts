import { HotelStatus } from "@common/enums/HotelStatus";

export interface HotelResponse {
    id: number;
    name: string;
    description: string;
    imageUrl: string;
    policy?: string;
    hostHotelName: string;
    status: HotelStatus;
    active: boolean;
    branchCount?: number;
}