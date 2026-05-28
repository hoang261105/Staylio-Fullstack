import { DiscountType } from "@common/enums/DiscountType";
import { VoucherScope } from "@common/enums/VoucherScope";

export interface ApplicableVoucherResponse {
    userVoucherId: number;
    voucherId: number;
    code: string;
    title: string;
    description: string;
    discountType: DiscountType;
    discountValue: number;
    minOrderValue: number;
    maxDiscountAmount: number;
    discountPreview: number;
    startDate: string;
    expiryDate: string;
    scope: VoucherScope;
    isUsed: boolean;
}