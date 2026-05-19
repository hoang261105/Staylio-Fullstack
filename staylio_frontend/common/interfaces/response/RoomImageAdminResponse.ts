import { ImageStatus } from "@common/enums/ImageStatus";

export interface RoomImageAdminResponse {
    id: number;
    imageUrl: string;
    roomId: number;
    roomName: string;
    roomNumber: string;
    ownerName: string;
    hotelBranchName: string;
    status: ImageStatus;
    isPrimary: boolean;
    createdAt: string;
    rejectionReason: string;
}