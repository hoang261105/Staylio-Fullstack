import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Settings,
  LogOut,
  Menu,
  X,
  Search,
  MapPin,
  Bed,
  Image,
  Tag,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Star,
  type LucideIcon,
} from "lucide-react";
import { useProfile } from "../../../common/hooks/useProfile";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import ConfirmLogoutModal from "../../../common/components/ConfirmLogoutModal";
import NotificationPopover from "../../../common/components/NotificationPopover";
import { useLogoutMutation } from "../../../common/hooks/useAuthMutation";

interface AdminLayoutProps {
  children: React.ReactNode;
}

const NAVIGATION_ITEMS = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
  { name: "Quản lý khách hàng", path: "/admin/customers", icon: Users },
  { name: "Quản lý thương hiệu khách sạn", path: "/admin/hotels", icon: Building2 },
  { name: "Quản lý chi nhánh", path: "/admin/hotel-branches", icon: MapPin },
  { name: "Quản lý phòng", path: "/admin/rooms", icon: Bed },
  { name: "Kiểm duyệt hình ảnh", path: "/admin/room-images", icon: Image },
  { name: "Quản lý tiện ích", path: "/admin/utilities", icon: Building2 },
  { name: "Quản lý Voucher", path: "/admin/vouchers", icon: Tag },
  { name: "Quản lý Đơn đặt phòng", path: "/admin/bookings", icon: Calendar },
  { name: "Quản lý đánh giá", path: "/admin/reviews", icon: Star },
  { name: "Cài đặt", path: "/admin/settings", icon: Settings },
];

interface SidebarItemProps {
  name: string;
  path: string;
  icon: LucideIcon;
  active: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

function SidebarItem({ name, icon: Icon, active, isCollapsed, onClick }: SidebarItemProps) {
  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={`w-full flex items-center h-11 rounded-xl transition-all duration-200 ${isCollapsed ? "justify-center px-0" : "px-3 gap-3.5"
          } ${active
            ? "bg-[#0066FF] text-white shadow-md shadow-[#0066FF]/20"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 group-hover:shadow-sm"
          }`}
      >
        <Icon
          className={`shrink-0 transition-colors duration-200 ${isCollapsed ? "w-6 h-6" : "w-5 h-5"
            } ${active ? "text-white" : "text-gray-400 group-hover:text-[#0066FF]"
            }`}
        />
        {!isCollapsed && (
          <span title={name} className="font-medium text-[14px] leading-tight truncate whitespace-nowrap tracking-wide">
            {name}
          </span>
        )}
      </button>

      {/* Tooltip for collapsed state */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
          {name}
          <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
        </div>
      )}
    </div>
  );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false); // Mobile
  const [isCollapsed, setIsCollapsed] = useState(false); // Desktop icon-only mode
  const { data: user } = useProfile();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutate: logoutMutate } = useLogoutMutation();

  // Auto collapse on small screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogout = () => {
    logoutMutate(undefined, {
      onSettled: () => {
        localStorage.removeItem("roleName");
        localStorage.removeItem("user");
        queryClient.clear();
        toast.success("Đăng xuất thành công!");
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      }
    });
  };

  const isActive = (path: string) => location.pathname === path;

  const sidebarWidth = isCollapsed ? "w-[80px]" : "w-[280px]";

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-gray-900 flex">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full bg-white border-r border-gray-100 shadow-sm flex flex-col transition-all duration-300 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } ${sidebarWidth}`}
      >
        <div className="h-16 flex items-center justify-between px-4 lg:px-6 border-b border-gray-100 shrink-0">
          <div className={`flex items-center gap-2 overflow-hidden transition-all duration-300 ${isCollapsed ? "w-8 opacity-0" : "w-32 opacity-100"}`}>
            {!isCollapsed && (
              <img
                src="/slogan.png"
                alt="Staylio"
                className="w-full h-auto object-contain whitespace-nowrap"
              />
            )}
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex items-center justify-center p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
          {NAVIGATION_ITEMS.map((item) => (
            <SidebarItem
              key={item.path}
              name={item.name}
              path={item.path}
              icon={item.icon}
              active={isActive(item.path)}
              isCollapsed={isCollapsed}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
            />
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-100 bg-gray-50/30">
          <div className={`flex items-center rounded-xl bg-white border border-gray-100 shadow-sm mb-3 transition-all ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-3"
            }`}>
            <img
              src={user?.avatarUrl}
              className={`rounded-full object-cover border-2 border-gray-50 shrink-0 ${isCollapsed ? "w-8 h-8" : "w-10 h-10"
                }`}
              alt={user?.fullName}
            />
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <div className="font-semibold text-[14px] text-gray-900 truncate">
                  {user?.fullName}
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5" title={user?.email}>
                  {user?.email}
                </div>
              </div>
            )}
          </div>

          <div className="relative group">
            <button
              onClick={() => setShowLogoutModal(true)}
              className={`w-full flex items-center justify-center h-11 rounded-xl text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-[14px] border border-transparent hover:border-red-100 ${isCollapsed ? "px-0" : "gap-2 px-4"
                }`}
            >
              <LogOut className={`shrink-0 ${isCollapsed ? "w-5 h-5" : "w-4 h-4"}`} />
              {!isCollapsed && <span>Đăng xuất</span>}
            </button>
            {isCollapsed && (
              <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-3 py-1.5 bg-red-600 text-white text-xs font-medium rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50 shadow-xl">
                Đăng xuất
                <div className="absolute top-1/2 -left-1 -translate-y-1/2 w-2 h-2 bg-red-600 rotate-45"></div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${isCollapsed ? "lg:ml-20" : "lg:ml-70"}`}>
        {/* Header */}
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-30 shrink-0 shadow-sm">
          <div className="h-full px-4 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg text-gray-600 transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h2 className="text-lg font-bold text-gray-800 hidden sm:block">
                {NAVIGATION_ITEMS.find((n) => isActive(n.path))?.name || "Admin Dashboard"}
              </h2>
            </div>

            <div className="flex-1 max-w-md hidden md:flex mx-auto">
              <div className="relative w-full group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-[#0066FF] transition-colors" />
                <input
                  type="text"
                  placeholder="Tìm kiếm thông tin nhanh..."
                  className="w-full pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-full focus:outline-none focus:ring-2 focus:ring-[#0066FF]/20 focus:bg-white focus:border-[#0066FF] transition-all text-sm font-medium"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <NotificationPopover />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-x-hidden overflow-y-auto">
          {children}
        </main>
      </div>

      <ConfirmLogoutModal
        open={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
}
