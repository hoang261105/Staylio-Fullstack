import { ApiResponse } from "@common/interfaces/ApiResponse";
import { VoucherQueryParams } from "@common/interfaces/request/QueryParams";
import { ApplicableVoucherResponse } from "@common/interfaces/response/ApplicableVoucherResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách voucher phòng của chi nhánh có thể áp dụng của tài khoản đó
export const getApplicableVouchers = async (params: VoucherQueryParams): Promise<ApiResponse<ApplicableVoucherResponse>> => {
    try {
        const response = await axiosInstance.get("/user-vouchers/applicable", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách voucher thất bại!", error);
        throw error;
    }
}