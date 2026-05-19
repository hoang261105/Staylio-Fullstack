import { RoomStatus } from "@common/enums/RoomStatus";
import { QueryParams } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { RoomRequest } from "@common/interfaces/request/RoomRequest";
import { RoomResponse } from "@common/interfaces/response/RoomResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách phòng
export const getRooms = async (params: QueryParams) => {
    try {
        const response = await axiosInstance.get('/rooms', { params });
        return response.data;
    } catch (error) {
        console.error('Lấy danh sách phòng thất bại:', error);
        throw error;
    }
}

// API lấy danh sách phòng không phân trang
export const getAllRooms = async (hotelBranchId: number) => {
    try {
        const response = await axiosInstance.get(`/rooms/${hotelBranchId}/lists`);
        return response.data; 
    } catch (error) {
        console.error('Lấy danh sách phòng thất bại:', error);
        throw error;
    }
}

// API lấy chi tiết phòng theo ID
export const getRoomById = async (roomId: number) => {
    try {
        const response = await axiosInstance.get(`/rooms/${roomId}`);
        return response.data;
    } catch (error) {
        console.error('Lấy chi tiết phòng thất bại:', error);
        throw error;
    }
}

// API thêm mới phòng
export const createRoom = async (roomData: RoomRequest): Promise<ApiResponse<RoomResponse>> => {
    try {
        const response = await axiosInstance.post('/rooms', roomData);
        return response.data;
    } catch (error) {
        console.error('Thêm mới phòng thất bại:', error);
        throw error;
    }
}

// API cập nhật thông tin phòng
export const updateRoom = async (roomId: number, roomData: RoomRequest): Promise<ApiResponse<RoomResponse>> => {
    try {
        const response = await axiosInstance.put(`/rooms/${roomId}`, roomData);
        return response.data;
    } catch (error) {
        console.error('Cập nhật phòng thất bại:', error);
        throw error;
    }
}

// API cập nhật trạng thái phòng
export const updateRoomStatus = async (roomId: number, status: RoomStatus): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/rooms/${roomId}/status`, { status });
        return response.data;
    } catch (error) {
        console.error('Cập nhật trạng thái phòng thất bại:', error);
        throw error;
    }
}

// API cập nhật trạng thái hoạt động phòng
export const updateRoomActive = async (roomId: number): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/rooms/${roomId}/update-active`);
        return response.data;
    } catch (error) {
        console.error('Cập nhật trạng thái hoạt động phòng thất bại:', error);
        throw error;
    }
}

// API cập nhật trạng thái áp dụng voucher cho phòng
export const updateRoomVoucherApplicable = async (roomId: number): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/rooms/${roomId}/update-voucher`);
        return response.data;
    } catch (error) {
        console.error('Cập nhật trạng thái áp dụng voucher cho phòng thất bại:', error);
        throw error;
    }
}