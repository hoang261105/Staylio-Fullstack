/* eslint-disable react-hooks/purity */
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Tags,
} from "lucide-react";
import AdminLayout from "../layout/AdminLayout";
import { useAdminStats } from "@common/hooks/useAdminStats";

const RECENT_BOOKINGS = [1, 2, 3, 4, 5];

const TOP_HOTELS = [
  { name: "Paradise Island Resort", bookings: 234, rating: 4.9 },
  { name: "Coastal Luxury Resort", bookings: 189, rating: 4.8 },
  { name: "Ocean Breeze Resort", bookings: 156, rating: 4.7 },
  { name: "Cliff View Hotel", bookings: 145, rating: 4.9 },
  { name: "Modern City Resort", bookings: 123, rating: 4.6 },
];

const MONTHLY_REVENUE = [65, 78, 85, 72, 90, 88, 95, 82, 78, 85, 92, 98];
const WEEK_DAYS = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

export default function Dashboard() {
  const { data: statsData } = useAdminStats();

  const STATS_DATA = [
    { name: "Tổng doanh thu", value: statsData ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0 }).format(statsData.totalRevenue) : "$0", change: "+12.5%", trend: "up", icon: DollarSign, color: "bg-blue-500" },
    { name: "Tổng số thương hiệu", value: statsData ? statsData.totalBrands.toLocaleString() : "0", change: "+8.2%", trend: "up", icon: Tags, color: "bg-green-500" },
    { name: "Khách hàng hoạt động", value: statsData ? statsData.activeCustomers.toLocaleString() : "0", change: "+23.1%", trend: "up", icon: Users, color: "bg-purple-500" },
    { name: "Chi nhánh khách sạn", value: statsData ? statsData.totalBranches.toLocaleString() : "0", change: "-2.4%", trend: "down", icon: Building2, color: "bg-orange-500" },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-500">Tổng quan hoạt động kinh doanh</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STATS_DATA.map((stat) => {
            const Icon = stat.icon;
            const TrendIcon = stat.trend === "up" ? TrendingUp : TrendingDown;

            return (
              <div
                key={stat.name}
                className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div
                    className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                      }`}
                  >
                    <TrendIcon className="w-3 h-3" />
                    {stat.change}
                  </div>
                </div>
                <div className="text-2xl font-semibold text-gray-900 mb-1">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.name}</div>
              </div>
            );
          })}
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Doanh thu theo tháng</h2>
              <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>2026</option>
                <option>2025</option>
                <option>2024</option>
              </select>
            </div>
            <div className="h-64 flex items-end justify-between gap-2">
              {MONTHLY_REVENUE.map((height, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-linear-to-t from-[#0066FF] to-[#00C896] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"
                    style={{ height: `${height}%` }}
                  />
                  <div className="text-xs text-gray-500 mt-2">T{idx + 1}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Bookings Chart */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Đặt phòng theo tuần</h2>
              <div className="flex gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#0066FF] rounded-full"></div>
                  <span className="text-gray-500">Đã xác nhận</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#00C896] rounded-full"></div>
                  <span className="text-gray-500">Chờ xử lý</span>
                </div>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-3">
              {WEEK_DAYS.map((day, idx) => {
                const confirmed = Math.random() * 80 + 20;
                const pending = Math.random() * 40 + 10;
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center">
                    <div className="w-full flex flex-col gap-1">
                      <div
                        className="w-full bg-[#00C896] rounded-t-sm hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ height: `${pending}px` }}
                      />
                      <div
                        className="w-full bg-[#0066FF] rounded-b-sm hover:opacity-80 transition-opacity cursor-pointer"
                        style={{ height: `${confirmed}px` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 mt-2">{day}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Đặt phòng gần đây</h2>
            <div className="space-y-2">
              {RECENT_BOOKINGS.map((i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-br from-[#0066FF] to-[#00C896] rounded-lg flex items-center justify-center text-white font-semibold">
                      {String.fromCharCode(65 + i)}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">Khách hàng #{i}</div>
                      <div className="text-sm text-gray-500">Paradise Resort</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-[#0066FF]">$450</div>
                    <div className="text-sm text-gray-500">{i} ngày trước</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Hotels */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Khách sạn nổi bật</h2>
            <div className="space-y-2">
              {TOP_HOTELS.map((hotel, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 flex items-center justify-center text-[#0066FF] rounded-lg font-semibold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{hotel.name}</div>
                      <div className="text-sm text-gray-500">{hotel.bookings} đặt phòng</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>★</span>
                    <span className="font-medium text-gray-700">{hotel.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}