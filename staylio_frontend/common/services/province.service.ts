import { SearchQueryParams } from "@common/interfaces/request/QueryParams";
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