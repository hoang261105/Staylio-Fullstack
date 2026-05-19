import { ImageStatus } from "@common/enums/ImageStatus";

export interface RoomImageResponse {
    id: number;
    roomName: string;
    imageUrl: string;
    isPrimary: boolean;
    status: ImageStatus
}