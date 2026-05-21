import { PaginationResponse } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { BookingStatusRequest } from "@common/interfaces/request/BookingStatusRequest";
import { BookingQueryParams } from "@common/interfaces/request/QueryParams";
import { BookingResponse } from "@common/interfaces/response/BookingResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách đơn đặt phòng
export const getAllBookings = async (params: BookingQueryParams): Promise<ApiResponse<PaginationResponse<BookingResponse>>> => {
    try {
        const response = await axiosInstance.get("/bookings", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách thất bại!", error);
        throw error;
    }
}

// API lấy chi tiết 1 đơn đặt phòng
export const getBookingById = async (id: number): Promise<ApiResponse<BookingResponse>> => {
    try {
        const response = await axiosInstance.get(`/bookings/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết 1 đơn đặt phòng thất bại!", error);
        throw error;
    }
}

// API cập nhật trạng thái đơn phòng
export const updateStatus = async (id: number, data: BookingStatusRequest): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/bookings/${id}/status`, data);
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái thất bại", error);
        throw error;
    }
}