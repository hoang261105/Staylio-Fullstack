import { BranchStatus } from "@common/enums/BranchStatus";

export interface HotelBranchResponse {
    id: number;
    provinceId: number;
    wardId: number;
    hotelBranchName: string;
    hotelId: number;
    hotelName: string;
    imageUrl: string | null;
    address: string;
    provinceName: string;
    wardName: string;
    capacity: number;
    phone: string;
    description: string;
    status: BranchStatus;
    countReview: number;
    averageRating: number;
    latitude: number;
    longitude: number;
}