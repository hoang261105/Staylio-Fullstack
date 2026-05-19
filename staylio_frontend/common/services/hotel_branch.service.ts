import { BranchStatus } from "@common/enums/BranchStatus";
import { QueryParams } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { HotelBranchRequest } from "@common/interfaces/request/HotelBranchRequest";
import { HotelIdRequest } from "@common/interfaces/request/HotelIdRequest";
import { HotelBranchResponse } from "@common/interfaces/response/HotelBranchResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// Lấy danh sách tất cả các chi nhánh khách sạn
export const getAllHotelBranches = async (params: QueryParams) => {
    try {
        const response = await axiosInstance.get("/hotel-branches", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách thất bại:", error);
        throw error;
    }
}

// Lấy danh sách chi nhánh của tôi
export const getMyHotelBranches = async (hotelId: number, status: BranchStatus) => {
    try {
        const response = await axiosInstance.get(`/hotel-branches/me`, { params: { hotelId, status } });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách thất bại:", error);
        throw error;
    }
}

// Lấy chi tiết một chi nhánh khách sạn theo ID
export const getHotelBranchById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/hotel-branches/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết thất bại:", error);
        throw error;
    }
}

// Thêm mới 1 chi nhánh khách sạn
export const createHotelBranch = async (branchData: HotelBranchRequest): Promise<ApiResponse<HotelBranchResponse>> => {
    try {
        const response = await axiosInstance.post("/hotel-branches", branchData);
        return response.data;
    } catch (error) {
        console.error("Thêm mới thất bại:", error);
        throw error;
    }
}

// Cập nhật thông tin một chi nhánh khách sạn
export const updateHotelBranch = async (id: number, branchData: HotelBranchRequest): Promise<ApiResponse<HotelBranchResponse>> => {
    try {
        const response = await axiosInstance.put(`/hotel-branches/${id}`, branchData);
        return response.data;
    } catch (error) {
        console.error("Cập nhật thất bại:", error);
        throw error;
    }
}

// Xóa 1 chi nhánh khách sạn
export const deleteHotelBranch = async (id: number, request: HotelIdRequest): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/hotel-branches/${id}`, request);
        return response.data;
    } catch (error) {
        console.error("Xóa thất bại:", error);
        throw error;
    }
}

// Duyệt 1 chi nhánh khách sạn
export const approveHotelBranch = async (id: number, status: BranchStatus): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/hotel-branches/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái thất bại:", error);
        throw error;
    }
}