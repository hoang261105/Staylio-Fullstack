import { PaginationResponse } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { ReviewQueryParams } from "@common/interfaces/request/QueryParams";
import { ReviewResponse } from "@common/interfaces/response/ReviewResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

// API lấy danh sách đánh giá phòng
export const getReviews = async (params: ReviewQueryParams): Promise<ApiResponse<PaginationResponse<ReviewResponse>>> => {
    try {
        const response = await axiosInstance.get("/reviews", { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách đánh giá thất bại!", error);
        throw error;
    }
}