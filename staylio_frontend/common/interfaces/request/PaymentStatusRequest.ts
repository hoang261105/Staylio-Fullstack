import { BookingStatus } from "@common/enums/BookingStatus";
import { PaymentStatus } from "@common/enums/PaymentStatus";

export interface PaymentStatusRequest {
    paymentStatus: PaymentStatus;
    bookingStatus: BookingStatus;
}