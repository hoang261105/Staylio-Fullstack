import { PaginationResponse, QueryParams } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { NotificationResponse } from "@common/interfaces/response/NotificationResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách thông báo theo người nhận
export const getAllNotificationsByReceiver = async (params: QueryParams): Promise<ApiResponse<PaginationResponse<NotificationResponse>>> => {
    try {
        const response = await axiosInstance.get("/notifications", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách thông báo thất bại!", error);
        throw error;
    }
}

// API lấy số thông báo chưa đọc của tài khoản
export const countNotificationsUnRead = async () => {
    try {
        const response = await axiosInstance.get("/notifications/me/unread-count");
        return response.data;
    } catch (error) {
        console.error("Lấy số lương thông báo chưa đọc thất bại", error);
        throw error;
    }
}

// API đánh dấu thông báo đã đọc
export const markNotificationAsRead = async (id: number): Promise<ApiResponse<void>> => {
    try {
        const response = await axiosInstance.patch(`/notifications/${id}/read`);
        return response.data;
    } catch (error) {
        console.error("Đánh dấu thông báo đã đọc thất bại", error);
        throw error;
    }
}