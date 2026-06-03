import { ApiResponse } from "@common/interfaces/ApiResponse";
import { ChatMessageResponse } from "@common/interfaces/response/ChatMessageResponse";
import { ChatSessionResponse } from "@common/interfaces/response/ChatSessionResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

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