import { ChatSessionStatus } from "@common/enums/ChatSessionStatus";
import { ChatSessionType } from "@common/enums/ChatSessionType";

export interface ChatSessionResponse {
    id: number;
    type: ChatSessionType;
    status: ChatSessionStatus;
    lastMessage: string;
    lastMessageAt: string;
    unreadCount: number;
    createdAt: string;
}