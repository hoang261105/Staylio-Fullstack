import { Calendar, Users } from "lucide-react";
import dayjs from "dayjs";

interface StayInfoCardProps {
    checkInDate: string;
    checkOutDate: string;
    adults: number;
    children: number;
    note: string;
    setNote: (note: string) => void;
}

export const StayInfoCard = ({
    checkInDate,
    checkOutDate,
    adults,
    children,
    note,
    setNote
}: StayInfoCardProps) => {
    
    const checkIn = dayjs(checkInDate);
    const checkOut = dayjs(checkOutDate);
    const nights = checkOut.diff(checkIn, "day");

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Thông tin lưu trú</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Nhận phòng</div>
                    <div className="font-bold text-gray-900">{checkIn.format("DD/MM/YYYY")}</div>
                    <div className="text-xs text-gray-500 mt-1">Từ 14:00</div>
                </div>
                <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/50 relative">
                    <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Trả phòng</div>
                    <div className="font-bold text-gray-900">{checkOut.format("DD/MM/YYYY")}</div>
                    <div className="text-xs text-gray-500 mt-1">Trước 12:00</div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Calendar className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">Tổng thời gian lưu trú</div>
                        <div className="text-sm text-gray-500">{nights} đêm</div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                        <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <div className="font-semibold text-gray-900">Khách</div>
                        <div className="text-sm text-gray-500">
                            {adults} người lớn {children > 0 && `, ${children} trẻ em`}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
                <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Ghi chú cho khách sạn (Tùy chọn)
                </label>
                <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Bạn có yêu cầu gì đặc biệt không?"
                    className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-xl focus:ring-blue-500 focus:border-blue-500 block p-3 text-sm font-medium outline-none transition-all resize-none h-24"
                />
            </div>
        </div>
    );
};
