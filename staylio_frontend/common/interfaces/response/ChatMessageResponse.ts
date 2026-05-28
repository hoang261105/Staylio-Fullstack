import { MessageSenderType } from "@common/enums/MessageSenderType";

export interface ChatMessageResponse {
    id: number;
    sessionId: number;
    senderId: number;
    senderName: string;
    senderAvatar: string;
    senderType: MessageSenderType;
    content: string;
    isRead: boolean;
    createdAt: string
}