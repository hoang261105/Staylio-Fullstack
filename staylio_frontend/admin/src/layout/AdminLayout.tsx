import { useState } from "react";
import { useNavigate, useLocation } from "react-router";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  MapPin,
  Bed,
  Image,
} from "lucide-react";
import { useProfile } from "../../../common/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmLogoutModal from "../../../common/components/ConfirmLogoutModal";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Quản lý khách hàng", path: "/admin/customers", icon: Users },
  { name: "Quản lý khách sạn", path: "/admin/hotels", icon: Building2 },
  {
    name: "Quản lý chi nhánh",
    path: "/admin/hotel-branches",
    icon: MapPin,
  },
  {
    name: "Quản lý phòng",
    path: "/admin/rooms",
    icon: Bed
  },
  {
    name: "Kiểm duyệt hình ảnh",
    path: "/admin/room-images",
    icon: Image,
  },
  {
    name: "Quản lý tiện ích",
    path: "/admin/utilities",
    icon: Building2
  },
  { name: "Cài đặt", path: "/admin/settings", icon: Settings },
];

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
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
      window.location.href = "/admin/login";
    }, 500);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200">
            <div className="w-32 inline-flex items-center">
              <img
                src="/slogan.png"
                alt="Staylio"
                className="w-full h-auto object-contain"
              />
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "bg-[#0066FF] text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3 px-4 py-3 mb-2 rounded-lg bg-gray-50 border border-gray-100">
              <img
                src={user?.avatarUrl}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0 text-left">
                <div className="font-medium text-gray-900 truncate">
                  {user?.fullName}
                </div>
                <div className="text-xs text-gray-500 truncate" title={user?.email}>
                  {user?.email}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowLogoutModal(true)}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="h-16 bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600"
            >
              <Menu className="w-6 h-6" />
            </button>

            <div className="hidden md:flex items-center flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#0066FF] focus:bg-white transition-all text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors">
                <Bell className="w-6 h-6" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 border border-white rounded-full"></span>
              </button>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-8">{children}</main>
      </div>

      <ConfirmLogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
