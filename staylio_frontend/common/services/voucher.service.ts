import { VoucherStatus } from "@common/enums/VoucherStatus";
import { ApprovalStatus } from "@common/enums/ApprovalStatus";
import { QueryParams } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { VoucherRequest } from "@common/interfaces/request/VoucherRequest";
import { VoucherResponse } from "@common/interfaces/response/VoucherResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách voucher
export const getAllVouchers = async (params: QueryParams) => {
    try {
        const response = await axiosInstance.get("/vouchers", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách thất bại!", error);
        throw error;
    }
}

// API lấy chi tiết 1 voucher
export const getVoucherById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/vouchers/${id}`);
        return response.data;        
    } catch (error) {
        console.error("Lấy chi tiết 1 voucher thất bại!", error);
        throw error
    }
}

// API tạo mới 1 voucher
export const createVoucher = async (data: VoucherRequest): Promise<ApiResponse<VoucherResponse>> => {
    try {
        const response = await axiosInstance.post("/vouchers", data);
        return response.data;
    } catch (error) {
        console.error("Thêm mới voucher thất bại!", error);
        throw error;
    }
}

// API cập nhật thông tin voucher
export const updateVoucher = async (id: number, data: VoucherRequest): Promise<ApiResponse<VoucherResponse>> => {
    try {
        const response = await axiosInstance.put(`/vouchers/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Cập nhật thông tin voucher thất bại!", error);
        throw error;
    }
}

// API cập nhật trạng thái của voucher
export const updateStatusVoucher = async (id: number, status: VoucherStatus): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(
            `/vouchers/${id}/status`,
            { status }
        );
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái voucher thất bại", error);
        throw error;
    }
}

// API cập nhật trạng thái duyệt của voucher
export const updateApprovalStatusVoucher = async (id: number, approvalStatus: ApprovalStatus): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(
            `/vouchers/${id}/approval-status`,
            { approvalStatus }
        );
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái duyệt voucher thất bại", error);
        throw error;
    }
}