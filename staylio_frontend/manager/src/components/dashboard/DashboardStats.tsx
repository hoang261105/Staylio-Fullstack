import { Users, Building2, CalendarCheck, TrendingUp, Loader2 } from "lucide-react";
import { useStatisticManager } from "@common/hooks/useStatisticManager";
import { formatCurrency } from "@common/utils/currency.util";

export default function DashboardStats() {
  const { data, isLoading, isError } = useStatisticManager();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-10">
        <Loader2 className="w-8 h-8 animate-spin text-[#0066FF]" />
      </div>
    );
  }

  if (isError || !data) {
    return null;
  }

  const stats = [
    {
      label: "Tổng số phòng",
      value: data.totalRooms.toString(),
      change: `${data.roomGrowth > 0 ? '+' : ''}${data.roomGrowth} so với tháng trước`,
      icon: Building2,
      trend: data.roomGrowth >= 0 ? "up" : "down",
      color: "blue",
    },
    {
      label: "Khách đang lưu trú",
      value: data.stayingGuests.toString(),
      change: `${data.guestGrowthPercent > 0 ? '+' : ''}${data.guestGrowthPercent}% so với tháng trước`,
      icon: Users,
      trend: data.guestGrowthPercent >= 0 ? "up" : "down",
      color: "green",
    },
    {
      label: "Đặt phòng mới",
      value: data.newBookings.toString(),
      change: `${data.bookingGrowthPercent > 0 ? '+' : ''}${data.bookingGrowthPercent}% so với tuần trước`,
      icon: CalendarCheck,
      trend: data.bookingGrowthPercent >= 0 ? "up" : "down",
      color: "purple",
    },
    {
      label: "Doanh thu ước tính",
      value: formatCurrency(data.estimatedRevenue),
      change: `${data.revenueGrowthPercent > 0 ? '+' : ''}${data.revenueGrowthPercent}% so với tháng trước`,
      icon: TrendingUp,
      trend: data.revenueGrowthPercent >= 0 ? "up" : "down",
      color: "emerald",
    },
  ];

  const getColorClasses = (color: string) => {
    switch (color) {
      case "blue":
        return "bg-blue-50 text-blue-600 border-blue-100";
      case "green":
        return "bg-green-50 text-green-600 border-green-100";
      case "purple":
        return "bg-purple-50 text-purple-600 border-purple-100";
      case "emerald":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      default:
        return "bg-gray-50 text-gray-600 border-gray-100";
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        const colorClasses = getColorClasses(stat.color);

        return (
          <div
            key={index}
            className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${colorClasses} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6" />
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">
                {stat.label}
              </p>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {stat.value}
              </h3>
              <p className={`text-xs font-medium inline-flex px-2 py-1 rounded-full ${
                stat.trend === "up" 
                  ? "text-emerald-600 bg-emerald-50" 
                  : "text-red-600 bg-red-50"
              }`}>
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
