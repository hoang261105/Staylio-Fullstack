import { PaymentMethod } from "@common/enums/PaymentMethod";

export interface BookingRequest {
    roomId: number;
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    userVoucherId: number | null;
    note: string;
    preferences: string;
    paymentMethod: PaymentMethod
}