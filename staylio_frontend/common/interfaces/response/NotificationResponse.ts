import { NotificationType } from "@common/enums/NotificationType";

export interface NotificationResponse {
    id: number;
    senderId: number;
    senderName: string;
    senderAvatar: string;
    receiverId: number;
    title: string;
    content: string;
    type: NotificationType;
    referenceId?: number;
    isRead: boolean;
    readAt: string;
    createdAt: string;
}