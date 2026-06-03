import { PaymentStatusRequest } from "@common/interfaces/request/PaymentStatusRequest";
import { axiosInstance } from "@common/utils/axiosInstance";

export const updatePaymentStatus = async (id: number, request: PaymentStatusRequest) => {
    try {
        const response = await axiosInstance.patch(`/payments/${id}/status`, request);
        return response.data;
    } catch (error) {
        console.error("Cập nhật thanh toán thất bại", error);
        throw error;
    }
}