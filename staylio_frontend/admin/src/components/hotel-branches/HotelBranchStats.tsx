export default function HotelBranchStats() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Tổng chi nhánh</div>
        <div className="text-2xl font-semibold text-gray-800">45</div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Hoạt động</div>
        <div className="text-2xl font-semibold text-green-600">38</div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Tạm dừng</div>
        <div className="text-2xl font-semibold text-gray-600">5</div>
      </div>
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Bị cấm</div>
        <div className="text-2xl font-semibold text-red-600">2</div>
      </div>
    </div>
  );
}
