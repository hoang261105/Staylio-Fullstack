import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Bed,
  Ticket,
  Image,
  CalendarCheck,
} from "lucide-react";
import { useProfile } from "@common/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmLogoutModal from "../components/ConfirmLogoutModal";

interface ManagerLayoutProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  { name: "Tổng quan", path: "/manager/dashboard", icon: LayoutDashboard },
  { name: "Chi nhánh của tôi", path: "/manager/branches", icon: Building2 },
  { name: "Quản lí phòng", path: "/manager/rooms", icon: Bed },
  { name: "Quản lí đơn đặt phòng", path: "/manager/bookings", icon: CalendarCheck },
  { name: "Quản lí voucher", path: "/manager/vouchers", icon: Ticket },
  { name: "Quản lí hình ảnh", path: "/manager/room-images", icon: Image },
  { name: "Cài đặt", path: "/settings", icon: Settings },
];

export default function ManagerLayout({ children }: ManagerLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: user } = useProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    const cookies = document.cookie.split("; ");
    const domain = window.location.hostname;
    const past = "expires=Thu, 01 Jan 1970 00:00:00 UTC";

    for (const cookie of cookies) {
      const name = cookie.split("=")[0];
      if (name) {
        document.cookie = `${name}=; ${past}; path=/; secure; samesite=strict`;
        document.cookie = `${name}=; ${past}; path=/;`;
        document.cookie = `${name}=; ${past}; path=/; domain=${domain}`;
      }
    }
    queryClient.clear();

    toast.success("Đăng xuất thành công!");
    setTimeout(() => {
      window.location.href = "/login";
    }, 500);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-100 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-100">
            <div className="w-32 inline-flex items-center text-[#0066FF] font-bold text-xl tracking-tight gap-2">
              <div className="w-32 inline-flex items-center">
                <img
                  src="/slogan.png"
                  alt="Staylio"
                  className="w-full h-auto object-contain"
                />
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="px-6 pt-6 pb-2">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Menu Quản Lý
            </p>
          </div>

          <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto">
            {NAVIGATION_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${active
                    ? "bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/20"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                >
                  <Icon
                    className={`w-5 h-5 ${active ? "text-white" : "text-gray-400"}`}
                  />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-100 bg-gray-50/50">
            <div className="flex items-center gap-3 px-3 py-3 mb-3 rounded-xl bg-white border border-gray-100 shadow-sm">
              <img
                src={user?.avatarUrl}
                className="w-10 h-10 rounded-full object-cover border-2 border-gray-50"
                alt={user?.fullName}
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-semibold text-gray-900 text-sm truncate">
                  {user?.fullName}
                </div>
                <div
                  className="text-xs text-gray-500 truncate"
                  title={user?.email}
                >
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shrink-0">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-semibold text-gray-800 hidden sm:block">
                {NAVIGATION_ITEMS.find((n) => isActive(n.path))?.name ||
                  "Manager"}
              </h2>
            </div>

            <div className="flex-1 max-w-md hidden md:flex">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông tin nhanh..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:bg-white focus:border-[#0066FF] transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative p-2 hover:bg-gray-50 text-gray-600 rounded-full transition-colors border border-gray-100">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 border-2 border-white rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-y-auto">{children}</main>
      </div>

      <ConfirmLogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
