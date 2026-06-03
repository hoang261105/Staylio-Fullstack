
export interface HotelBranchRequest {
    branchName: string;
    address: string;
    phone: string;
    description: string;
    hotelId: number | null;
    wardId: number | null;
    imageUrl: string;
    capacity: number | null;
    latitude: number | null;
    longitude: number | null;
}