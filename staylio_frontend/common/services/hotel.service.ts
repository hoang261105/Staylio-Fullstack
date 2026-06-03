import { HotelStatus } from "@common/enums/HotelStatus";
import { QueryParams } from "@common/interfaces"
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { HotelRequest } from "@common/interfaces/request/HotelRequest";
import { HotelResponse } from "@common/interfaces/response/HotelResponse";
import { axiosInstance } from "@common/utils/axiosInstance"

// Lây danh sách thương hiệu khách sạn
export const getAllHotels = async (params: QueryParams) => {
    try {
        const response = await axiosInstance.get("/hotels", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách khách sạn thất bại!");
        throw error;
    }
}

// Lấy danh sách thương hiệu khách sạn không phân trang
export const getHotels = async () => {
    try {
        const response = await axiosInstance.get("/hotels/lists");
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách thương hiệu khách sạn thất bại", error);
        throw error;
    }
}

// Lấy chi tiết khách sạn theo ID
export const getHotelById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/hotels/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết khách sạn thất bại!");
        throw error;
    }
}

// Thêm mới thương hiệu khách sạn
export const createHotel = async (data: HotelRequest): Promise<ApiResponse<HotelResponse>> => {
    try {
        const response = await axiosInstance.post("/hotels", data);
        return response.data;
    } catch (error) {
        console.error("Tạo mới khách sạn thất bại:", error);
        throw error;
    }
}

// Cập nhật thông tin thương hiệu khách sạn của chủ quản lý
export const updateHotelByManager = async (id: number, data: HotelRequest): Promise<ApiResponse<HotelResponse>> => {
    try {
        const response = await axiosInstance.put(`/hotels/${id}`, data);
        return response.data;
    } catch (error) {
        console.error("Cập nhật thông tin khách sạn thất bại!");
        throw error;
    }
}

// Lấy ra thương hiệu khách sạn của quản lí
export const getHotelByManager = async () => {
    try {
        const response = await axiosInstance.get("/hotels/my-hotel", {
            withCredentials: true,
        });
        return response.data;
    } catch (error) {
        console.error("Lấy thông tin khách sạn của quản lý thất bại!");
        throw error;
    }
}

// Cập nhật trạng thái duyệt của thương hiệu khách sạn
export const updateHotelStatus = async (id: number, status: HotelStatus): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/hotels/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái khách sạn thất bại!");
        throw error;
    }
}

// Cập nhật trạng thái hoạt động của thương hiệu khách sạn (bulk)
export const updateHotelActiveStatus = async (ids: number[], active: boolean): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/hotels/bulk-active`, { ids, active });
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái hoạt động khách sạn thất bại!");
        throw error;
    }
}

// Bật/tắt hoạt động của một thương hiệu khách sạn
export const updateSingleHotelActiveStatus = async (id: number): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/hotels/${id}/active`);
        return response.data;
    } catch (error) {
        console.error("Bật/tắt trạng thái hoạt động khách sạn thất bại!", error);
        throw error;
    }
}