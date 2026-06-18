/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useMemo } from "react";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building2,
  DollarSign,
  Tags,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import AdminLayout from "../layout/AdminLayout";
import { useAdminStats } from "@common/hooks/useAdminStats";
import { useAdminRevenueStats } from "@common/hooks/useAdminRevenueStats";
import { useAdminWeeklyBookings } from "@common/hooks/useAdminWeeklyBookings";
import { useBookings } from "@common/hooks/useBookings";
import { useHotelBranchs } from "@common/hooks/useHotelBranch";
import { formatCurrency } from "@common/utils/currency.util";
import dayjs from "dayjs";
import type { BookingQueryParams, QueryParams } from "@common/interfaces/request/QueryParams";


export default function Dashboard() {
  const [year, setYear] = useState<number>(2026);

  const { data: statsData } = useAdminStats();
  const { data: revenueData } = useAdminRevenueStats(year);
  const { data: weeklyBookings } = useAdminWeeklyBookings();

  const { data: recentBookingsData } = useBookings({
    page: 0,
    size: 5,
    sortBy: "createdAt",
    direction: "desc",
  } as BookingQueryParams);
  const recentBookings = recentBookingsData?.items || [];

  const { data: topHotelsData } = useHotelBranchs({
    page: 0,
    size: 1000,
    search: "",
  } as QueryParams);
  
  const topHotels = useMemo(() => {
    if (!topHotelsData?.items) return [];

    return [...topHotelsData.items]
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 5);
  }, [topHotelsData]);
  const formattedRevenueData = revenueData?.map((item) => ({
    name: `T${item.month}`,
    revenue: item.revenue,
  })) || [];

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
              <select
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={2026}>2026</option>
                <option value={2025}>2025</option>
                <option value={2024}>2024</option>
              </select>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedRevenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066FF" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0066FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} tickFormatter={(value) => `$${value}`} dx={-10} />
                  <RechartsTooltip
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    formatter={(value: any) => [`$${value}`, 'Doanh thu']}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#0066FF" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
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
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyBookings || []} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="dayOfWeek" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dx={-10} />
                  <RechartsTooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  />
                  <Bar dataKey="confirmed" name="Đã xác nhận" stackId="a" fill="#0066FF" radius={[0, 0, 4, 4]} barSize={32} />
                  <Bar dataKey="pending" name="Chờ xử lý" stackId="a" fill="#00C896" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tables Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Đặt phòng gần đây</h2>
            <div className="space-y-2">
              {recentBookings.map((booking) => {
                const daysAgo = dayjs().diff(dayjs(booking.createdAt), "day");
                const timeText = daysAgo === 0 ? "Hôm nay" : `${daysAgo} ngày trước`;

                return (
                  <div
                    key={booking.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-linear-to-br from-[#0066FF] to-[#00C896] rounded-lg flex items-center justify-center text-white font-semibold">
                        {booking.customerName?.charAt(0)?.toUpperCase() || "G"}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{booking.customerName}</div>
                        <div className="text-sm text-gray-500">{booking.hotelBranchName}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-medium text-[#0066FF]">{formatCurrency(booking.finalPrice)}</div>
                      <div className="text-sm text-gray-500">{timeText}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Top Hotels */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Khách sạn nổi bật</h2>
            <div className="space-y-2">
              {topHotels.map((hotel, idx) => (
                <div
                  key={hotel.id}
                  className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-50 flex items-center justify-center text-[#0066FF] rounded-lg font-semibold">
                      #{idx + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{hotel.hotelBranchName}</div>
                      <div className="text-sm text-gray-500">{hotel.countReview} đánh giá</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    <span>★</span>
                    <span className="font-medium text-gray-700">{hotel.averageRating || 0}</span>
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