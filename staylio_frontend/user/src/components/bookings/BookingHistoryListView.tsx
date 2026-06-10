import dayjs from "dayjs";
import { BookingStatus } from "../../../../common/enums/BookingStatus";
import {
  bookingStatusColors,
  bookingStatusLabels,
} from "../../../../common/utils/booking.util";
import { Building2, Calendar, Hash, MapPin, Users } from "lucide-react";
import type { BookingHistoryResponse } from "../../../../common/interfaces/response/BookingHistoryResponse";
import { useTranslation } from "react-i18next";
import { Button } from "../../../../common/components/ui/button";

interface BookingHistoryListViewProps {
  bookings: BookingHistoryResponse[];
  isLoading: boolean;
  onCancel: (bookingId: number) => void;
}

export default function BookingHistoryListView({
  bookings,
  isLoading,
  onCancel,
}: BookingHistoryListViewProps) {
  const { t } = useTranslation();
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="animate-pulse bg-card p-6 rounded-2xl border border-border flex gap-6"
          >
            <div className="w-32 h-32 bg-muted rounded-xl shrink-0"></div>
            <div className="flex-1 space-y-4">
              <div className="h-6 bg-muted rounded w-1/3"></div>
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="bg-card p-12 rounded-2xl border border-border text-center">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-card-foreground mb-1">
          {t('bookingHistory.noBookingsFound')}
        </h3>
        <p className="text-muted-foreground">
          {t('bookingHistory.noBookingsFoundDesc')}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => {
        const statusKey = booking.status as keyof typeof bookingStatusLabels;
        const statusLabel = t(`bookingStatus.${statusKey}`, bookingStatusLabels[statusKey] || booking.status);
        const statusColorClass =
          bookingStatusColors[statusKey] ||
          "bg-muted text-muted-foreground border-border";

        return (
          <div
            key={booking.bookingId}
            className="bg-card p-4 md:p-6 rounded-2xl border border-border hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6"
          >
            <div className="w-full md:w-40 h-48 md:h-32 shrink-0">
              <img
                src={booking.imageUrl || "/placeholder-room.jpg"}
                alt={booking.roomName}
                className="w-full h-full object-cover rounded-xl"
              />
            </div>

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${statusColorClass}`}
                    >
                      {statusLabel}
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1 bg-muted px-2 py-1 rounded-full border border-border">
                      <Hash className="w-3 h-3" />
                      {booking.bookingCode}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t('bookingHistory.bookedAt')}
                    {dayjs(booking.createdAt).format("HH:mm - DD/MM/YYYY")}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-card-foreground mb-1">
                  {booking.roomName}
                </h3>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.hotelName}</span>
                  </div>
                  <div className="flex items-center gap-1.5 border-l pl-4 border-border">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span>{booking.hotelBranchName}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-3 bg-muted rounded-xl mb-4">
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">
                      {t('bookingHistory.checkIn')}
                    </div>
                    <div className="font-semibold text-card-foreground">
                      {dayjs(booking.checkInDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">
                      {t('bookingHistory.checkOut')}
                    </div>
                    <div className="font-semibold text-card-foreground">
                      {dayjs(booking.checkOutDate).format("DD/MM/YYYY")}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">
                      {t('bookingHistory.guests')}
                    </div>
                    <div className="flex items-center gap-1.5 font-semibold text-card-foreground">
                      <Users className="w-3.5 h-3.5" />
                      {t('bookingHistory.guestCount', { adults: booking.adults, children: booking.children })}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] uppercase font-bold text-muted-foreground mb-0.5">
                      {t('bookingHistory.totalPrice')}
                    </div>
                    <div className="font-bold text-primary">
                      {booking.finalPrice.toLocaleString(t('homeScreen.hero.locale', 'vi-VN'))} {t('homeScreen.hero.currency', '₫')}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                {booking.status === BookingStatus.PENDING_PAYMENT && (
                  <>
                    {booking.paymentUrl && (
                      <Button
                        onClick={() => window.location.href = booking.paymentUrl!}
                        className="shadow-sm font-semibold"
                      >
                        {t('bookingHistory.payNow')}
                      </Button>
                    )}
                    <Button
                      variant="destructive"
                      onClick={() => onCancel(booking.bookingId)}
                      className="font-semibold"
                    >
                      {t('bookingHistory.cancelAction')}
                    </Button>

                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
