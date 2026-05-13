import { Users, Building2, CalendarCheck, TrendingUp } from "lucide-react";

export default function DashboardStats() {
  const stats = [
    {
      label: "Tổng số phòng",
      value: "124",
      change: "+2 so với tháng trước",
      icon: Building2,
      trend: "up",
      color: "blue",
    },
    {
      label: "Khách đang lưu trú",
      value: "86",
      change: "+12% so với tháng trước",
      icon: Users,
      trend: "up",
      color: "green",
    },
    {
      label: "Đặt phòng mới",
      value: "45",
      change: "+5% so với tuần trước",
      icon: CalendarCheck,
      trend: "up",
      color: "purple",
    },
    {
      label: "Doanh thu ước tính",
      value: "320.5M",
      change: "+8.4% so với tháng trước",
      icon: TrendingUp,
      trend: "up",
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
              <p className="text-xs font-medium text-emerald-600 bg-emerald-50 inline-flex px-2 py-1 rounded-full">
                {stat.change}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
