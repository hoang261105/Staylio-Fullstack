import { ReviewStatus } from "@common/enums/ReviewStatus";
import { PaginationResponse } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { ReviewQueryParams } from "@common/interfaces/request/QueryParams";
import { ReviewRequest } from "@common/interfaces/request/ReviewRequest";
import { ReviewerResponse } from "@common/interfaces/response/ReviewerResponse";
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

// API lấy danh sách tất cả khách hàng đã đánh giá
export const getAllReviewers = async (): Promise<ApiResponse<ReviewerResponse[]>> => {
    try {
        const response = await axiosInstance.get("/reviews/reviewers");
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách khách hàng đánh giá thất bại!", error);
        throw error;
    }
}

// API lấy chi tiết 1 đánh giá
export const getReviewById = async (id: number): Promise<ApiResponse<ReviewResponse>> => {
    try {
        const response = await axiosInstance.get(`/reviews/${id}`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết đánh giá thất bại!", error);
        throw error;
    }
}

// API tạo mới 1 đánh giá sau khi trả phòng
export const createReview = async (request: ReviewRequest): Promise<ApiResponse<ReviewResponse>> => {
    try {
        const response = await axiosInstance.post("/reviews", request);
        return response.data;
    } catch (error) {
        console.error("Tạo đánh giá thất bại", error);
        throw error;
    }
}

// API cập nhật phản hồi khách hàng
export const updateReplyComment = async (id: number, replyComment: string): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/reviews/${id}/reply-comment`, { replyComment });
        return response.data;
    } catch (error) {
        console.error("Cập nhật phản hồi khách hàng thất bại", error);
        throw error;
    }
}

// API cập nhật trạng thái đánh giá
export const updateStatusReview = async (id: number, status: ReviewStatus): Promise<ApiResponse<string>> => {
    try {
        const response = await axiosInstance.patch(`/reviews/${id}/status`, { status });
        return response.data;
    } catch (error) {
        console.error("Cập nhật trạng thái thất bại", error);
        throw error;
    }
}