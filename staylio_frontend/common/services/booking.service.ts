import { PaginationResponse } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { BookingRequest } from "@common/interfaces/request/BookingRequest";
import { BookingStatusRequest } from "@common/interfaces/request/BookingStatusRequest";
import { BookingQueryParams, QueryParams } from "@common/interfaces/request/QueryParams";
import { BookingHistoryResponse } from "@common/interfaces/response/BookingHistoryResponse";
import { BookingPreviewResponse } from "@common/interfaces/response/BookingPreviewResponse";
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

// API Preview giá phòng trc khi đặt
export const previewBooking = async (request: BookingRequest): Promise<ApiResponse<BookingPreviewResponse>> => {
    try {
        const response = await axiosInstance.post("/bookings/preview", request);
        return response.data;
    } catch (error) {
        console.error("Preview phòng thất bại", error);
        throw error;
    }
}

// API đặt phòng
export const createBooking = async (request: BookingRequest): Promise<ApiResponse<BookingResponse>> => {
    try {
        const response = await axiosInstance.post("/bookings", request);
        return response.data;
    } catch (error) {
        console.error("Đặt phòng thất bại", error);
        throw error;
    }
}

// API lấy các ngày đã đặt của một phòng
export const getBookedDates = async (roomId: number): Promise<ApiResponse<{ checkInDate: string; checkOutDate: string }[]>> => {
    try {
        const response = await axiosInstance.get(`/bookings/room/${roomId}/booked-dates`);
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách ngày đã đặt thất bại", error);
        throw error;
    }
}

// API lấy lịch sử đặt phòng
export const getHistoryBookings = async (params: QueryParams): Promise<ApiResponse<PaginationResponse<BookingHistoryResponse>>> => {
    try {
        const response = await axiosInstance.get("/bookings/history", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách lịch sử đặt phòng thất bại", error);
        throw error;
    }
}