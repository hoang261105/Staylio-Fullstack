import { ApiResponse } from "@common/interfaces/ApiResponse";
import { SearchQueryParams } from "@common/interfaces/request/QueryParams";
import { FeaturedLocationResponse } from "@common/interfaces/response/FeaturedLocationResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// Api lấy danh sách các tỉnh thành
export const getAllProvinces = async (params: SearchQueryParams) => {
    try {
        const response = await axiosInstance.get("/provinces", { params });
        return response.data; 
    } catch (error) {
        console.error("Lấy danh sách tỉnh thành thất bại", error);
        throw error;
    }
}

// API lấy danh sách xã/phường của 1 tỉnh thành
export const getWardsByProvinceId = async (provinceId: number, params: SearchQueryParams) => {
    try {
        const response = await axiosInstance.get(`/provinces/${provinceId}/wards`, { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách xã/phường thất bại", error);
        throw error;
    }
}

// API lấy danh sách các tỉnh thành nhiều khách sạn nhất
export const getFeaturedLocations = async (): Promise<ApiResponse<FeaturedLocationResponse[]>> => {
    try {
        const response = await axiosInstance.get("/provinces/featured");
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách địa điểm nổi bật thất bại!", error);
        throw error;
    }
}

// API lấy danh sách các tỉnh thành có phân trang
export const getFeaturedLocationsPaged = async (page: number, limit: number) => {
    try {
        const response = await axiosInstance.get("/provinces/locations/paged", {
            params: { page, limit }
        });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách địa điểm nổi bật phân trang thất bại!", error);
        throw error;
    }
}