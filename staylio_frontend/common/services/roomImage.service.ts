import { PaginationResponse, QueryParams } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { RoomImageStatusRequest } from "@common/interfaces/request/RoomImageStatusRequest";
import { RoomImageAdminResponse } from "@common/interfaces/response/RoomImageAdminResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách hình ảnh phòng
export const getAllImages = async (
  params: QueryParams,
): Promise<ApiResponse<PaginationResponse<RoomImageAdminResponse>>> => {
  try {
    const response = await axiosInstance.get("/room-images", { params });
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách thất bại!", error);
    throw error;
  }
};

// API lấy chi tiết hình ảnh phòng
export const getRoomImageById = async (id: number): Promise<ApiResponse<RoomImageAdminResponse>> => {
  try {
    const response = await axiosInstance.get(`/room-images/${id}`);
    return response.data;
  } catch (error) {
    console.error("Lấy chi tiết hình ảnh phòng thất bại", error);
    throw error;
  }
}

// API cập nhật trạng thái hình ảnh phòng
export const updateStatus = async (id: number, request: RoomImageStatusRequest): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch(`/room-images/${id}/status`, request);
    return response.data;
  } catch (error) {
    console.error("Cập nhật trạng thái thất bại!", error);
    throw error;
  }
}