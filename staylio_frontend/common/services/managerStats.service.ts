import { ApiResponse } from "@common/interfaces/ApiResponse";
import { ManagerDashboardStatsResponse } from "@common/interfaces/response/ManagerDashboardStatsResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API thống kê của quản lí
export const getDashBoardStats = async (): Promise<ApiResponse<ManagerDashboardStatsResponse>> => {
    try {
        const response = await axiosInstance.get("/statistic-manager/dashboard/stats");
        return response.data;
    } catch (error) {
        console.error("Thống kê thất bại!", error);
        throw error;
    }
}