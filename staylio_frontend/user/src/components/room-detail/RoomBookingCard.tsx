import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { InputField } from "../../../../common/components/InputField";
import { useApiErrors } from "../../../../common/hooks/useApiErrors";
import { useBookedDates } from "../../../../common/hooks/useBookings";
import { useProfile } from "../../../../common/hooks/useProfile";
import type { RoomResponse } from "../../../../common/interfaces/response/RoomResponse";

interface RoomBookingCardProps {
  room: RoomResponse;
  roomId: number;
}

export default function RoomBookingCard({ room, roomId }: RoomBookingCardProps) {
  const navigate = useNavigate();
  const { data: user } = useProfile();
  const { fieldErrors, clearFieldError } = useApiErrors();
  
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const handleBookNow = () => {
    if (!checkInDate || !checkOutDate) {
      toast.error("Vui lòng chọn ngày nhận và trả phòng");
      return;
    }
    if (!adults || adults <= 0) {
      toast.error("Vui lòng nhập số lượng người lớn");
      return;
    }

    const formatDate = (d: Date) => {
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    navigate("/booking/confirmation", {
      state: {
        roomId,
        checkInDate: formatDate(checkInDate),
        checkOutDate: formatDate(checkOutDate),
        adults: Number(adults),
        children: Number(children) || 0,
      },
    });
  };

  return (
    <div className="sticky top-28 bg-white border border-gray-200 rounded-2xl shadow-xl p-6">
      <div className="flex items-end gap-1 mb-6 pb-6 border-b border-gray-100">
        <span className="text-3xl font-bold text-blue-600">
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(room.price)}
        </span>
        <span className="text-gray-500 font-medium">/ đêm</span>
      </div>

      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-xl overflow-hidden p-1 bg-gray-50/50">
          <div className="p-2 text-left border-r border-gray-200">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Nhận phòng
            </label>
            <DatePicker
              selected={checkInDate}
              onChange={handleCheckInChange}
              minDate={today}
              excludeDateIntervals={excludeCheckInIntervals}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              className="text-sm font-semibold text-gray-900 bg-transparent outline-none w-full cursor-pointer placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
          <div className="p-2 text-left">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
              Trả phòng
            </label>
            <DatePicker
              selected={checkOutDate}
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              onChange={(date: any) => setCheckOutDate(date)}
              minDate={minCheckOutDate}
              excludeDateIntervals={excludeCheckOutIntervals}
              dateFormat="dd/MM/yyyy"
              placeholderText="Chọn ngày"
              className="text-sm font-semibold text-gray-900 bg-transparent outline-none w-full cursor-pointer placeholder:font-normal placeholder:text-gray-400"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-2">
          <InputField
            label="Người lớn"
            type="number"
            min={1}
            max={room.maxAdults}
            value={adults}
            onChange={handleAdultsChange}
            error={fieldErrors.adults}
            placeholder={`Tối đa: ${room.maxAdults}`}
          />
          <InputField
            label="Trẻ em"
            type="number"
            min={0}
            max={room.maxChildren}
            value={children}
            onChange={handleChildrenChange}
            error={fieldErrors.children}
            placeholder={`Tối đa: ${room.maxChildren}`}
          />
        </div>
      </div>

      {user ? (
        <>
          <button
            onClick={handleBookNow}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
          >
            Đặt phòng ngay
          </button>
          <p className="text-center text-xs text-gray-400 mt-4">
            Bạn chưa bị trừ tiền lúc này
          </p>
        </>
      ) : (
        <button
          onClick={() => navigate("/login")}
          className="w-full py-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-lg shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          Bạn cần đăng nhập để đặt phòng
        </button>
      )}
    </div>
  );
}
