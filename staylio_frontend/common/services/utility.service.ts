import { QueryParams } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { UtilityRequest } from "@common/interfaces/request/UtitlityRequest";
import { UtilityResponse } from "@common/interfaces/response/UtilityResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách các tiện ích
export const getUtilities = async (params: QueryParams) => {
    try {
        const response = await axiosInstance.get("/utilities", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách tiện ích thất bại:", error);
        throw error;
    }
}

// API lấy danh sách không có phân trang
export const getAllUtilities = async () => {
    try {
        const response = await axiosInstance.get("/utilities/list");
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách tiện ích thất bại:", error);
        throw error;
    }
}

// API lấy chi tiết 1 tiện ích
export const getUtilityById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/utilities/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết tiện ích thất bại:", error);
        throw error;
    }
}

// API tạo mới 1 tiện ích
export const createUtility = async (utility: UtilityRequest): Promise<ApiResponse<UtilityResponse>> => {
    try {
        const response = await axiosInstance.post("/utilities", utility);
        return response.data;
    } catch (error) {
        console.error("Tạo mới tiện ích thất bại:", error);
        throw error;
    }
}

// API cập nhật 1 tiện ích
export const updateUtility = async (id: number, utility: UtilityRequest): Promise<ApiResponse<UtilityResponse>> => {
    try {
        const response = await axiosInstance.put(`/utilities/${id}`, utility);
        return response.data;
    } catch (error) {
        console.error("Cập nhật thông tin tiện ích thất bại!", error);
        throw error;
    }
}

// API cập nhật trạng thái 1 tiện ích
export const updateUtilityActive = async (id: number): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/utilities/${id}/active`);
        return response.data;
    } catch (error) {
        console.error("Cập nhật thất bại", error);
        throw error;
    }
}