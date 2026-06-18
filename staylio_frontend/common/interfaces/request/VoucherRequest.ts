import { DiscountType } from "@common/enums/DiscountType";

export interface VoucherRequest {
    code: string;
    title: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number;
    hotelBranchId?: number;
    applyToAllBranches?: boolean;
    totalUsageLimit: number;
    usageLimitPerUser: number;
    startDate: string;
    expiryDate: string;
    isWelcomeVoucher: boolean;
}