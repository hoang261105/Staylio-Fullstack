import { createChatWithAI, getMessages, sendAIMessage } from "@common/services/chatSession.service";
import { useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast";

export const useCreateChatAIMutation = () => {
    return useMutation({
        mutationKey: ["createChatAI"],
        mutationFn: async () => {
            const response = await createChatWithAI();
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
        }
    });
}

export const useSendAIMessage = (sessionId: number) => {
    return useMutation({
        mutationKey: ["sendAIMessage", sessionId],
        mutationFn: async (content: string) => {
            const response = await sendAIMessage(sessionId, content);
            return response;
        },
        onSuccess: (response) => {
            toast.success(response.message);
        }
    });
}

export const useGetMessagesQuery = (sessionId: number) => {
    return useQuery({
        queryKey: ["getMessages", sessionId],
        queryFn: async () => {
            const response = await getMessages(sessionId);
            return response.data;
        },
        enabled: sessionId > 0
    });
}