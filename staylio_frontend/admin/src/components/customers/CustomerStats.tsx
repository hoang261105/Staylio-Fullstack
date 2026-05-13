
interface CustomerStatsProps {
  totalCustomers: number;
}

export default function CustomerStats({ totalCustomers }: CustomerStatsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Tổng khách hàng</div>
        <div className="text-2xl font-semibold text-gray-900">{totalCustomers}</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Khách hàng mới (tháng)</div>
        <div className="text-2xl font-semibold text-green-600">0</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">VIP</div>
        <div className="text-2xl font-semibold text-purple-600">0</div>
      </div>
      <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
        <div className="text-sm text-gray-500 mb-1">Hoạt động hôm nay</div>
        <div className="text-2xl font-semibold text-blue-600">0</div>
      </div>
    </div>
  );
}
