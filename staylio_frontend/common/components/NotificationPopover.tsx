import { useState, useRef, useEffect } from "react";
import { Bell, Info, Calendar, Star, Building2, Tag, Image as ImageIcon, MessageCircle } from "lucide-react";
import { useCountNotificationUnRead, useNotifications } from "../hooks/useNotifications";
import { formatDateTime } from "../utils/date.util";
import { NotificationType } from "../enums/NotificationType";
import { useMarkNotificationReadMutation } from "../hooks/useNotifications";
import { useNavigate } from "react-router-dom";
import { NotificationResponse } from "../interfaces/response/NotificationResponse";
import { getReviewById } from "../services/review.service";
import { useTranslation } from "react-i18next";

export default function NotificationPopover() {
  const { t } = useTranslation();
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

    if (!notification.referenceId) return;

    const role = localStorage.getItem("roleName");
    const type = notification.type;

    if (type.startsWith("BOOKING_")) {
      if (role === "ROLE_CUSTOMER") navigate("/booking-history", { state: { bookingId: notification.referenceId } });
      if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN") navigate("/bookings", { state: { bookingId: notification.referenceId } });
    } else if (type.startsWith("REVIEW_")) {
      if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN") navigate("/reviews", { state: { reviewId: notification.referenceId } });
      if (role === "ROLE_CUSTOMER") {
        getReviewById(notification.referenceId).then(res => {
          const review = res.data;
          if (review) {
            navigate(`/hotel/${review.hotelId}/branch/${review.hotelBranchId}/room/${review.roomId}/reviews`);
          }
        }).catch(err => {
          console.error("Lỗi khi lấy thông tin đánh giá:", err);
        });
      }
    } else if (type.startsWith("VOUCHER_")) {
      if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN") navigate("/vouchers", { state: { voucherId: notification.referenceId } });
    } else if (type.startsWith("ROOM_IMAGE_")) {
      if (role === "ROLE_MANAGER" || role === "ROLE_ADMIN") navigate("/room-images", { state: { imageId: notification.referenceId } });
    } else if (type.startsWith("HOTEL_BRANCH_") || type.startsWith("HOTEL_BRAND_")) {
      if (role === "ROLE_ADMIN") navigate("/hotel-branches", { state: { branchId: notification.referenceId } });
      if (role === "ROLE_MANAGER") navigate("/branches", { state: { branchId: notification.referenceId } });
    } else if (type === "CHAT_MESSAGE_CREATED") {
      if (role === "ROLE_MANAGER") navigate("/branches");
      // For customer, they can open the chat widget manually
    }
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
      <button
        onClick={() => setIsOpen(!isOpen)}
        title={t('components.notification.title', 'Thông báo')}
        className="relative p-2 hover:bg-gray-50 text-gray-600 rounded-full transition-colors border border-gray-100 bg-white"
      >
        <Bell className="w-5 h-5" />

        {Number(unreadCount) > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-white shadow-sm">
            {Number(unreadCount) > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="fixed left-4 right-4 top-19 mt-0 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-2 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-100 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 border-b border-gray-100 bg-gray-50/50 flex items-center justify-between">
            <h3 className="font-bold text-gray-900">{t('components.notification.title', 'Thông báo')}</h3>
            {Number(unreadCount) > 0 && (
              <span className="text-xs font-medium text-[#0066FF] bg-blue-50 px-2.5 py-1 rounded-full">
                {unreadCount} {t('components.notification.unread', 'chưa đọc')}
              </span>
            )}
          </div>

          <div className="max-h-100 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-8 gap-3">
                <div className="w-6 h-6 border-2 border-[#0066FF] border-t-transparent rounded-full animate-spin"></div>
                <span className="text-xs text-gray-500 font-medium">{t('components.notification.loading', 'Đang tải thông báo...')}</span>
              </div>
            ) : notifications.length === 0 ? (
              <div className="py-12 text-center flex flex-col items-center justify-center text-gray-500">
                <Bell className="w-8 h-8 mb-2 text-gray-300" />
                <span className="text-sm font-medium">{t('components.notification.empty', 'Không có thông báo nào.')}</span>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`p-4 hover:bg-gray-50 transition-colors flex gap-3 cursor-pointer ${!notification.isRead ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="shrink-0 mt-0.5">
                      {notification.senderAvatar ? (
                        <img
                          src={notification.senderAvatar}
                          alt={notification.senderName}
                          className="w-10 h-10 rounded-full object-cover border border-gray-200"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center shadow-sm border border-gray-200/60">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm leading-tight ${!notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-800'}`}>
                        {notification.title}
                      </p>
                      <p className={`text-xs mt-1 line-clamp-2 leading-relaxed ${!notification.isRead ? 'text-gray-700 font-medium' : 'text-gray-500'}`}>
                        {notification.content}
                      </p>
                      <div className="text-[10px] text-gray-400 mt-2 flex items-center gap-1.5 font-medium">
                        <span className="truncate">{notification.senderName || t('components.notification.system', 'Hệ thống')}</span>
                        <span>•</span>
                        <span>{formatDateTime(notification.createdAt)}</span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <div className="shrink-0 w-2 h-2 bg-[#0066FF] rounded-full mt-1.5 shadow-sm shadow-[#0066FF]/50"></div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center hover:bg-gray-100 transition-colors cursor-pointer">
              <span className="text-sm font-semibold text-[#0066FF]">
                {t('components.notification.viewAll', 'Xem tất cả')}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
