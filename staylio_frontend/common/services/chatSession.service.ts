import { ApiResponse } from "@common/interfaces/ApiResponse";
import { SendChatMessageRequest } from "@common/interfaces/request/SendChatMessageRequest";
import { ChatMessageResponse } from "@common/interfaces/response/ChatMessageResponse";
import { ChatSessionResponse } from "@common/interfaces/response/ChatSessionResponse";
import { axiosInstance } from "@common/utils/axiosInstance";
import { StartManagerChatRequest } from "@common/interfaces/request/StartManagerChatRequest";
import { PaginationResponse } from "@common/interfaces/response/PaginationResponse";
// API tạo phiên chat với AI
export const createChatWithAI = async (): Promise<ApiResponse<ChatSessionResponse>> => {
    try {
        const response = await axiosInstance.post("/chat/ai/session");
        return response.data;
    } catch (error) {
        console.error("Tạo phiên chat với AI thất bại!", error);
        throw error;
    }
}

// API gửi tin nhắn cho AI
export const sendAIMessage = async (sessionId: number, content: string): Promise<ApiResponse<ChatMessageResponse>> => {
    try {
        const response = await axiosInstance.post(`/chat/ai/${sessionId}/messages`, { content });
        return response.data;
    } catch (error) {
        console.error("Gửi tin nhắn thất bại!", error);
        throw error;
    }
}

// API lấy lịch sử đoạn chat
export const getMessages = async (sessionId: number): Promise<ApiResponse<ChatMessageResponse[]>> => {
    try {
        const response = await axiosInstance.get(`/chat/sessions/${sessionId}/messages`);
        return response.data;
    } catch (error) {
        console.error("Lấy lịch sử đoạn chat thất bại!", error);
        throw error;
    }
}

// API lấy chi tiết phiên chat
export const getChatSessionById = async (sessionId: number): Promise<ApiResponse<ChatSessionResponse>> => {
    try {
        const response = await axiosInstance.get(`/chat/sessions/${sessionId}/detail`);
        return response.data;
    } catch (error) {
        console.error("Lấy chi tiết phiên chat thất bại!", error);
        throw error;
    }
}

// API bắt đâu phiên chat với Manager
export const startChatWithManager = async (request: StartManagerChatRequest): Promise<ApiResponse<ChatSessionResponse>> => {
    try {
        const response = await axiosInstance.post(`/chat/manager/start`, request);
        return response.data;
    } catch (error) {
        console.error("Bắt đầu phiên chat với Manager thất bại!", error);
        throw error;
    }
}

// API khách hàng gửi tin nhắn cho Manager
export const sendManagerMessage = async (request: SendChatMessageRequest): Promise<ApiResponse<ChatMessageResponse>> => {
    try {
        const response = await axiosInstance.post(`/chat/manager/messages`, request);
        return response.data;
    } catch (error) {
        console.error("Gửi tin nhắn cho Manager thất bại!", error);
        throw error;
    }
}

// API manager phản hồi tin nhắn của khách hàng
export const replyToCustomer = async (request: SendChatMessageRequest): Promise<ApiResponse<ChatMessageResponse>> => {
    try {
        const response = await axiosInstance.post(`/chat/manager/reply`, request);
        return response.data;
    } catch (error) {
        console.error("Phản hồi tin nhắn cho khách hàng thất bại!", error);
        throw error;
    }
}

// API lấy danh sách phiên chat của khách hàng
export const getChatSessions = async (): Promise<ApiResponse<ChatSessionResponse[]>> => {
    try {
        const response = await axiosInstance.get(`/chat/manager`);
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách phiên chat thất bại!", error);
        throw error;
    }
}

export const managerReply = async (data: SendChatMessageRequest) => {
    return axiosInstance.post<ApiResponse<ChatMessageResponse>>("/chat/manager/reply", data);
};

export const getMyManagerSessions = async (params: { page?: number; size?: number }) => {
    return axiosInstance.get<ApiResponse<PaginationResponse<ChatSessionResponse>>>("/chat/manager", { params });
};

export const getManagerSessionsByBranchId = async (branchId: number, params: { page?: number; size?: number }) => {
    try {
        const response = await axiosInstance.get(`/chat/manager/branch/${branchId}`, { params });
        return response.data;
    } catch (error) {
        console.error("Lấy danh sách phiên chat chi nhánh thất bại!", error);
        throw error;
    }
};