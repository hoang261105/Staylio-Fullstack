import { UserStatus } from "@common/enums/UserStatus";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { QueryParams } from "@common/interfaces/request/QueryParams";
import { UserRegisterRequest } from "@common/interfaces/request/UserRegisterRequest";
import { UserResponse } from "@common/interfaces/response/UserResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// Lấy danh sách khách hàng từ API
export const getAllCustomers = async (params: QueryParams) => {
  try {
    const response = await axiosInstance.get("/users", {
      params,
    });
    return response.data;
  } catch (error) {
    console.error("Lấy danh sách thất bại!");
    throw error;
  }
};

// Lấy chi tiết 1 khách hàng
export const getCustomerById = async (id: number) => {
    try {
        const response = await axiosInstance.get(`/users/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết 1 khách hàng thất bại!");
        throw error;
    }
}

// Thêm mới 1 khách hàng
export const createCustomer = async (request: UserRegisterRequest): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await axiosInstance.post("/users", request);
    return response.data;
  } catch (error) {
    console.error("Thêm mới khách hàng thất bại!");
    throw error;
  }
}

// Cập nhật trạng thái khóa/mở khóa khách hàng
export const updateCustomerStatus = async (id: number): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch(`/users/${id}/status`);
    return response.data;
  } catch (error) {
    console.error("Cập nhật trạng thái khách hàng thất bại!");
    throw error;
  }
}

// Khóa/Mở khóa nhiều khách hàng cùng lúc
export const bulkUpdateCustomerStatus = async (ids: number[], status: UserStatus): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch("/users/bulk-status", { ids, status });
    return response.data;
  } catch (error) {
    console.error("Cập nhật trạng thái khách hàng thất bại!");
    throw error;
  }
}