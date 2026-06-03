interface HotelStatsProps {
  totalHotels: number;
  activeHotels: number;
}

export default function HotelStats({ totalHotels, activeHotels }: HotelStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Tổng khách sạn</div>
        <div className="text-2xl font-semibold text-gray-900">{totalHotels}</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Đang hoạt động</div>
        <div className="text-2xl font-semibold text-green-600">{activeHotels}</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Khách sạn 5 sao</div>
        <div className="text-2xl font-semibold text-yellow-600">0</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Đánh giá trung bình</div>
        <div className="text-2xl font-semibold text-blue-600">0.0</div>
      </div>
    </div>
  );
}