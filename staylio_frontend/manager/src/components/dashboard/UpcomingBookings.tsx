import { useBookings } from "@common/hooks/useBookings";
import { format } from "date-fns";
import { Loader2, CalendarClock, ArrowRightToLine, ArrowLeftFromLine } from "lucide-react";
import { BookingStatus } from "@common/enums/BookingStatus";
import type { BookingResponse } from "@common/interfaces/response/BookingResponse";

export default function UpcomingBookings({ hotelBranchId }: { hotelBranchId: number }) {
  // Lấy danh sách booking CONFIRMED (đợi check-in)
  const { data: checkInResponse, isLoading: isLoadingIn, isError: isErrorIn } = useBookings({
    hotelBranchId,
    status: BookingStatus.CONFIRMED,
    page: 0,
    size: 5,
    sortBy: "checkInDate",
    direction: "asc"
  });

  // Lấy danh sách booking CHECKED_IN (đợi check-out)
  const { data: checkOutResponse, isLoading: isLoadingOut, isError: isErrorOut } = useBookings({
    hotelBranchId,
    status: BookingStatus.CHECKED_IN,
    page: 0,
    size: 5,
    sortBy: "checkOutDate",
    direction: "asc"
  });

  const isLoading = isLoadingIn || isLoadingOut;

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const getUpcomingEvents = () => {
    const events: (BookingResponse & { eventType: 'checkin' | 'checkout', date: Date })[] = [];
    if (checkInResponse && checkInResponse.items) {
      checkInResponse.items.forEach(b => {
        events.push({ ...b, eventType: 'checkin', date: new Date(b.checkInDate) });
      });
    }
    if (checkOutResponse && checkOutResponse.items) {
      checkOutResponse.items.forEach(b => {
        events.push({ ...b, eventType: 'checkout', date: new Date(b.checkOutDate) });
      });
    }

    // Sắp xếp các sự kiện theo thời gian gần nhất
    return events.sort((a, b) => a.date.getTime() - b.date.getTime()).slice(0, 5);
  };

  const upcomingEvents = getUpcomingEvents();

  if ((isErrorIn && isErrorOut) || upcomingEvents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
        <CalendarClock className="w-10 h-10 mb-3 opacity-30" />
        <p>Không có dữ liệu hôm nay</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcomingEvents.map((event) => (
        <div key={`${event.id}-${event.eventType}`} className="flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted transition-colors rounded-xl">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${event.eventType === 'checkin' ? 'bg-blue-50 text-blue-600' : 'bg-orange-50 text-orange-600'
            }`}>
            {event.eventType === 'checkin' ? <ArrowRightToLine className="w-6 h-6" /> : <ArrowLeftFromLine className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <div className="flex flex-wrap justify-between items-start mb-1 gap-2">
              <span className="font-semibold text-foreground">{event.roomName}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${event.eventType === 'checkin' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
                }`}>
                {event.eventType === 'checkin' ? 'Sắp Check-in' : 'Sắp Check-out'}
              </span>
            </div>
            <div className="flex flex-wrap justify-between items-center text-sm text-muted-foreground gap-2">
              <span className="truncate max-w-[150px]">{event.customerName}</span>
              <span className="font-medium text-foreground">
                {format(event.date, "HH:mm, dd/MM/yyyy")}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
