/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputField } from "../../../../common/components/InputField";
import { useApiErrors } from "../../../../common/hooks/useApiErrors";
import { useBookedDates, usePreviewBookingMutation } from "../../../../common/hooks/useBookings";
import { useProfile } from "../../../../common/hooks/useProfile";
import { useTranslation } from "react-i18next";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";
import { PaymentMethod } from "../../../../common/enums/PaymentMethod";
import { Button } from "../../../../common/components/ui/button";

interface RoomBookingCardProps {
  room: RoomResponse;
  roomId: number;
}

export default function RoomBookingCard({ room, roomId }: RoomBookingCardProps) {
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { fieldErrors, clearFieldError, handleApiErrors } = useApiErrors();
  const { t } = useTranslation();
  const { mutateAsync: previewBooking, isPending } = usePreviewBookingMutation();

  const [checkInDate, setCheckInDate] = useState<Date | null>(null);
  const [checkOutDate, setCheckOutDate] = useState<Date | null>(null);
  const [adults, setAdults] = useState<number | "">(1);
  const [children, setChildren] = useState<number | "">(0);

  const { data: bookedDatesData } = useBookedDates(roomId);

  const today = new Date();
  const minCheckOutDate = checkInDate
    ? new Date(checkInDate.getTime() + 86400000)
    : new Date(today.getTime() + 86400000);

  const excludeCheckInIntervals = useMemo(() => {
    if (!bookedDatesData) return [];
    return bookedDatesData.map((d: any) => {
      const end = new Date(d.checkOutDate);
      end.setDate(end.getDate() - 1);
      return {
        start: new Date(d.checkInDate),
        end,
      };
    });
  }, [bookedDatesData]);

  const excludeCheckOutIntervals = useMemo(() => {
    if (!bookedDatesData) return [];
    return bookedDatesData.map((d: any) => {
      const start = new Date(d.checkInDate);
      start.setDate(start.getDate() + 1);
      return {
        start,
        end: new Date(d.checkOutDate),
      };
    });
  }, [bookedDatesData]);

  const handleCheckInChange = (date: Date | null) => {
    setCheckInDate(date);
    if (date && checkOutDate && date >= checkOutDate) {
      setCheckOutDate(new Date(date.getTime() + 86400000));
    }
  };

  const handleAdultsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: number | "" = e.target.value ? Number(e.target.value) : "";
    if (val !== "") {
      const maxVal = room?.maxAdults || 1;
      if (val > maxVal) val = maxVal;
    }
    setAdults(val);
    clearFieldError("adults");
  };

  const handleChildrenChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val: number | "" = e.target.value ? Number(e.target.value) : "";
    if (val !== "") {
      const maxVal = room?.maxChildren || 0;
      if (val > maxVal) val = maxVal;
    }
    setChildren(val);
    clearFieldError("children");
  };

  const handleBookNow = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error(t("roomDetail.missingDates"));
      return;
    }
    if (!adults || adults <= 0) {
      toast.error(t("roomDetail.missingAdults"));
      return;
    }

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const checkInDateStr = formatDate(checkInDate);
    const checkOutDateStr = formatDate(checkOutDate);

    try {
      await previewBooking({
        roomId,
        checkInDate: checkInDateStr,
        checkOutDate: checkOutDateStr,
        adults: Number(adults),
        children: Number(children) || 0,
        note: "",
        preferences: "{}",
        paymentMethod: PaymentMethod.CASH,
      });

      navigate("/booking/confirmation", {
        state: {
          roomId,
          checkInDate: checkInDateStr,
          checkOutDate: checkOutDateStr,
          adults: Number(adults),
          children: Number(children) || 0,
        },
      });
    } catch (error: any) {
      if (error?.response?.data?.errors) {
        handleApiErrors(error.response.data.errors);
      } else {
        toast.error(error?.response?.data?.message || t("roomDetail.bookingFailed"));
      }
    }
  };

  return (
    <div className="sticky top-28 bg-card border border-border rounded-2xl shadow-xl p-6">
      <div className="flex items-end gap-1 mb-6 pb-6 border-b border-border">
        <span className="text-3xl font-bold text-primary">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(room.price)}
        </span>
        <span className="text-muted-foreground font-medium">{t("roomDetail.perNight")}</span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-2 gap-2 border border-input rounded-xl overflow-hidden p-1 bg-background">
          <div className="p-2 text-left border-r border-border">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              {t("roomDetail.checkIn")}
            </label>
            <DatePicker
              selected={checkInDate}
              onChange={handleCheckInChange}
              minDate={today}
              excludeDateIntervals={excludeCheckInIntervals}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("roomDetail.selectDate")}
              className="text-sm font-semibold text-foreground bg-transparent outline-none w-full cursor-pointer placeholder:font-normal placeholder:text-muted-foreground"
            />
          </div>
          <div className="p-2 text-left">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-1 block">
              {t("roomDetail.checkOut")}
            </label>
            <DatePicker
              selected={checkOutDate}
              onChange={(date: any) => setCheckOutDate(date)}
              minDate={minCheckOutDate}
              excludeDateIntervals={excludeCheckOutIntervals}
              dateFormat="dd/MM/yyyy"
              placeholderText={t("roomDetail.selectDate")}
              className="text-sm font-semibold text-foreground bg-transparent outline-none w-full cursor-pointer placeholder:font-normal placeholder:text-muted-foreground"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <InputField
            label={t("roomDetail.adults")}
            type="number"
            min={1}
            max={room.maxAdults}
            value={adults}
            onChange={handleAdultsChange}
            onKeyDown={(e: any) => {
              if (!["ArrowUp", "ArrowDown", "Tab"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e: any) => e.preventDefault()}
            error={fieldErrors.adults}
            placeholder={`${t("roomDetail.max")}: ${room.maxAdults}`}
          />
          <InputField
            label={t("roomDetail.children")}
            type="number"
            min={0}
            max={room.maxChildren}
            value={children}
            onChange={handleChildrenChange}
            onKeyDown={(e: any) => {
              if (!["ArrowUp", "ArrowDown", "Tab"].includes(e.key)) {
                e.preventDefault();
              }
            }}
            onPaste={(e: any) => e.preventDefault()}
            error={fieldErrors.children}
            placeholder={`${t("roomDetail.max")}: ${room.maxChildren}`}
          />
        </div>
      </div>

      {user ? (
        <>
          <Button
            onClick={handleBookNow}
            disabled={isPending}
            className="w-full py-6 font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
          >
            {isPending ? "Đang kiểm tra..." : t("roomDetail.bookNow")}
          </Button>
          <p className="text-center text-xs text-muted-foreground mt-4">
            {t("roomDetail.notChargedYet")}
          </p>
        </>
      ) : (
        <Button
          onClick={() => navigate("/login")}
          className="w-full py-6 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all"
        >
          {t("roomDetail.loginToBook")}
        </Button>
      )}
    </div>
  );
}
