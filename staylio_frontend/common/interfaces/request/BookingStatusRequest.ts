import { BookingStatus } from "@common/enums/BookingStatus";

export interface BookingStatusRequest {
    status: BookingStatus;
    cancellationReason?: string;
}