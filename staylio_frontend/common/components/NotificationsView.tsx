import { useState } from "react";
import { Bell, Info, Calendar, Star, Building2, Tag, Image as ImageIcon, MessageCircle } from "lucide-react";
import { useNotifications, useMarkNotificationReadMutation } from "../hooks/useNotifications";
import { formatDateTime } from "../utils/date.util";
import { NotificationType } from "../enums/NotificationType";
import { useNavigate } from "react-router-dom";
import { NotificationResponse } from "../interfaces/response/NotificationResponse";
import { navigateByNotification } from "../utils/notification.util";
import { useTranslation } from "react-i18next";
import Pagination from "./Pagination";

export default function NotificationsView() {
  const { t } = useTranslation();
  const [page, setPage] = useState(0);
  const size = 10;

  const { data: notificationsData, isLoading } = useNotifications({
    page,
    size
  });

  const notifications = notificationsData?.items || [];
  const totalPages = notificationsData?.pagination.totalPages || 0;

  const markAsReadMutation = useMarkNotificationReadMutation();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    navigateByNotification(notification, navigate);
  };

  const getNotificationIcon = (type: NotificationType) => {
    if (type.startsWith("BOOKING_")) return <Calendar className="w-6 h-6 text-blue-500" />;
    if (type.startsWith("REVIEW_")) return <Star className="w-6 h-6 text-amber-500" />;
    if (type.startsWith("HOTEL_")) return <Building2 className="w-6 h-6 text-indigo-500" />;
    if (type.startsWith("VOUCHER_")) return <Tag className="w-6 h-6 text-emerald-500" />;
    if (type.startsWith("ROOM_IMAGE_")) return <ImageIcon className="w-6 h-6 text-purple-500" />;
    if (type === "CHAT_MESSAGE_CREATED") return <MessageCircle className="w-6 h-6 text-blue-500" />;
    return <Info className="w-6 h-6 text-gray-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-card text-card-foreground rounded-2xl shadow-sm border border-border overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-muted/30">
          <h2 className="text-2xl font-bold">{t('components.notification.title', 'Thông báo của bạn')}</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Quản lý và xem lại tất cả các thông báo từ hệ thống
          </p>
        </div>

        <div className="p-0 min-h-[400px]">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-muted-foreground font-medium">{t('components.notification.loading', 'Đang tải thông báo...')}</span>
            </div>
          ) : notifications.length === 0 ? (
            <div className="py-20 text-center flex flex-col items-center justify-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 opacity-50" />
              </div>
              <span className="text-lg font-medium">{t('components.notification.empty', 'Không có thông báo nào.')}</span>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {notifications.map((notification: NotificationResponse) => (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`p-6 hover:bg-muted/50 transition-colors flex gap-5 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`}
                >
                  <div className="shrink-0 mt-1">
                    {notification.senderAvatar ? (
                      <img
                        src={notification.senderAvatar}
                        alt={notification.senderName}
                        className="w-12 h-12 rounded-full object-cover border border-border shadow-sm"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center shadow-sm border border-border">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-4">
                      <p className={`text-base leading-snug ${!notification.isRead ? 'font-bold text-foreground' : 'font-medium text-foreground/90'}`}>
                        {notification.title}
                      </p>
                      {!notification.isRead && (
                        <div className="shrink-0 w-2.5 h-2.5 bg-primary rounded-full mt-1.5 shadow-sm shadow-primary/50"></div>
                      )}
                    </div>
                    <p className={`text-sm mt-2 leading-relaxed ${!notification.isRead ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`}>
                      {notification.content}
                    </p>
                    <div className="text-xs text-muted-foreground mt-3 flex items-center gap-2 font-medium">
                      <span className="truncate">{notification.senderName || t('components.notification.system', 'Hệ thống')}</span>
                      <span>•</span>
                      <span>{formatDateTime(notification.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}
