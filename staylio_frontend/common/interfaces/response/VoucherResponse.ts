import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import { DiscountType } from "@common/enums/DiscountType";
import { VoucherStatus } from "@common/enums/VoucherStatus";

export interface VoucherResponse {
    id: number;
    code: string;
    title: string;
    description: string;
    discountType: DiscountType,
    discountValue: number,
    minOrderValue: number,
    maxDiscountAmount: number,
    hotelBranchId: number;
    hotelBranchName: string,
    totalUsageLimit: number,
    currentUsageCount: number,
    usageLimitPerUser: number,
    startDate: string,
    expiryDate: string,
    status: VoucherStatus,
    approvalStatus: ApprovalStatus
}