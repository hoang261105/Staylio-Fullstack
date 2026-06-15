import { useState, useRef, useEffect } from "react";
import { Bell, Info, Calendar, Star, Building2, Tag, Image as ImageIcon, MessageCircle } from "lucide-react";
import { useCountNotificationUnRead, useNotifications } from "../hooks/useNotifications";
import { formatDateTime } from "../utils/date.util";
import { NotificationType } from "../enums/NotificationType";
import { useMarkNotificationReadMutation } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { NotificationResponse } from "../interfaces/response/NotificationResponse";
import { navigateByNotification } from "../utils/notification.util";
import { useTranslation } from "react-i18next";
import { Button } from "./ui/button";

interface NotificationPopoverProps {
  forceLight?: boolean;
}

export default function NotificationPopover({ forceLight = false }: NotificationPopoverProps) {
  const { t } = useTranslation();

  const cx = (classes: string) => {
    if (!forceLight) return classes;
    return classes.split(' ').filter(c => !c.startsWith('dark:')).join(' ');
  };
  const [isOpen, setIsOpen] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  const { data: notificationsData, isLoading } = useNotifications({
    page: 0,
    size: 5
  });

  const notifications = notificationsData?.items || [];
  const { data: unreadCount } = useCountNotificationUnRead();
  const markAsReadMutation = useMarkNotificationReadMutation();
  const navigate = useNavigate();

  const handleNotificationClick = (notification: NotificationResponse) => {
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }

    setIsOpen(false);
    navigateByNotification(notification, navigate);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getNotificationIcon = (type: NotificationType) => {
    if (type.startsWith("BOOKING_")) return <Calendar className="w-5 h-5 text-blue-500" />;
    if (type.startsWith("REVIEW_")) return <Star className="w-5 h-5 text-amber-500" />;
    if (type.startsWith("HOTEL_")) return <Building2 className="w-5 h-5 text-indigo-500" />;
    if (type.startsWith("VOUCHER_")) return <Tag className="w-5 h-5 text-emerald-500" />;
    if (type.startsWith("ROOM_IMAGE_")) return <ImageIcon className="w-5 h-5 text-purple-500" />;
    if (type === "CHAT_MESSAGE_CREATED") return <MessageCircle className="w-5 h-5 text-blue-500" />;
    return <Info className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="relative" ref={popoverRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        title={t('components.notification.title', 'Thông báo')}
        className={cx("relative rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors")}
      >
        <Bell className="w-5 h-5" />

        {Number(unreadCount) > 0 && (
          <span className={cx("absolute -top-1 -right-1 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold border-2 border-background shadow-sm")}>
            {Number(unreadCount) > 99 ? "99+" : unreadCount}
          </span>
        )}
      </Button>
      {isOpen && (
        <div className={cx("fixed left-4 right-4 top-19 mt-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-popover text-popover-foreground rounded-2xl shadow-xl border border-border overflow-hidden z-100 animate-in fade-in slide-in-from-top-2 duration-200")}>
          <div className={cx("px-4 py-3 border-b border-border bg-muted/50 flex items-center justify-between")}>
            <h3 className={cx("font-bold text-foreground")}>{t('components.notification.title', 'Thông báo')}</h3>
            {Number(unreadCount) > 0 && (
              <span className={cx("text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-full")}>
                {unreadCount} {t('components.notification.unread', 'chưa đọc')}
              </span>
            )}
          </div>

          <div className="max-h-100 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-muted-foreground font-medium">{t('components.notification.loading', 'Đang tải thông báo...')}</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className={cx("py-12 text-center flex flex-col items-center justify-center text-muted-foreground")}>
                <Bell className={cx("w-8 h-8 mb-2 opacity-50")} />
                <span className="text-sm font-medium">{t('components.notification.empty', 'Không có thông báo nào.')}</span>
              </div>
            ) : (
              <div className={cx("divide-y divide-border")}>
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={cx(`p-4 hover:bg-accent hover:text-accent-foreground transition-colors flex gap-3 cursor-pointer ${!notification.isRead ? 'bg-primary/5' : ''}`)}
                  >
                    <div className="shrink-0 mt-0.5">
                      {notification.senderAvatar ? (
                        <img
                          src={notification.senderAvatar}
                          alt={notification.senderName}
                          className={cx("w-10 h-10 rounded-full object-cover border border-border")}
                        />
                      ) : (
                        <div className={cx("w-10 h-10 rounded-full bg-muted flex items-center justify-center shadow-sm border border-border")}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cx(`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-foreground' : 'text-foreground'}`)}>
                        {notification.title}
                      </p>
                      <p className={cx(`text-xs mt-1 line-clamp-2 leading-relaxed ${!notification.isRead ? 'text-muted-foreground font-medium' : 'text-muted-foreground'}`)}>
                        {notification.content}
                      </p>
                      <div className={cx("text-[10px] text-muted-foreground mt-2 flex items-center gap-1.5 font-medium")}>
                        <span className="truncate">{notification.senderName || t('components.notification.system', 'Hệ thống')}</span>
                        <span>•</span>
                        <span>{formatDateTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="shrink-0 w-2 h-2 bg-primary rounded-full mt-1.5 shadow-sm shadow-primary/50"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div
              onClick={() => {
                setIsOpen(false);
                navigate('/notifications');
              }}
              className={cx("p-3 border-t border-border bg-muted/50 text-center hover:bg-muted transition-colors cursor-pointer")}
            >
              <span className={cx("text-sm font-semibold text-primary")}>
                {t('components.notification.viewAll', 'Xem tất cả')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
