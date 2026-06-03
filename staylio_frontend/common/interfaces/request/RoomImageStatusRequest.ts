import { ImageStatus } from "@common/enums/ImageStatus";

export interface RoomImageStatusRequest {
    status: ImageStatus;
    rejectionReason: string;
}