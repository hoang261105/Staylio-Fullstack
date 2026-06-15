import { createChatWithAI, getMessages, sendAIMessage, startChatWithManager, sendManagerMessage, replyToCustomer, getChatSessions, getManagerSessionsByBranchId, getChatSessionById } from "@common/services/chatSession.service";
import { useMutation, useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast";
import { StartManagerChatRequest } from "@common/interfaces/request/StartManagerChatRequest";
import { SendChatMessageRequest } from "@common/interfaces/request/SendChatMessageRequest";

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

export const useGetChatSessionByIdQuery = (sessionId: number) => {
    return useQuery({
        queryKey: ["getChatSessionById", sessionId],
        queryFn: async () => {
            const response = await getChatSessionById(sessionId);
            return response.data;
        },
        enabled: sessionId > 0
    });
}

export const useStartManagerChatMutation = () => {
    return useMutation({
        mutationKey: ["startManagerChat"],
        mutationFn: async (request: StartManagerChatRequest) => {
            const response = await startChatWithManager(request);
            return response;
        }
    });
}

export const useSendManagerMessage = (sessionId: number) => {
    return useMutation({
        mutationKey: ["sendManagerMessage", sessionId],
        mutationFn: async (content: string) => {
            const request: SendChatMessageRequest = { sessionId, content };
            const response = await sendManagerMessage(request);
            return response;
        }
    });
}

export const useReplyToCustomerMutation = (sessionId: number) => {
    return useMutation({
        mutationKey: ["replyToCustomer", sessionId],
        mutationFn: async (content: string) => {
            const request: SendChatMessageRequest = { sessionId, content };
            const response = await replyToCustomer(request);
            return response;
        }
    });
}

export const useGetChatSessionsQuery = () => {
    return useQuery({
        queryKey: ["getChatSessions"],
        queryFn: async () => {
            const response = await getChatSessions();
            return response.data;
        }
    });
}

export const useManagerSessionsByBranchQuery = (branchId: number, page: number = 1, size: number = 10) => {
    return useQuery({
        queryKey: ["getManagerSessionsByBranch", branchId, page, size],
        queryFn: async () => {
            const response = await getManagerSessionsByBranchId(branchId, { page, size });
            return response.data;
        },
        enabled: branchId > 0
    });
}