/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "../../../common/components/ConfirmLogoutModal";
import NotificationPopover from "../../../common/components/NotificationPopover";
import { Heart, History, LogOut, User, ChevronDown, Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../../common/hooks/useProfile";
import { useLogoutMutation } from "../../../common/hooks/useAuthMutation";
import { useAllHotels } from "../../../common/hooks/useHotels";
import { useFeaturedProvinces } from "../../../common/hooks/useProvinces";
import { HotelStatus } from "../../../common/enums/HotelStatus";
import type { HotelResponse } from "../../../common/interfaces/response/HotelResponse";
import type { FeaturedLocationResponse } from "../../../common/interfaces/response/FeaturedLocationResponse";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { i18n } = useTranslation();

  const { data: user } = useProfile();
  const { data: hotelsData } = useAllHotels();
  const { data: featuredLocations } = useFeaturedProvinces();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutate: logoutMutate } = useLogoutMutation();

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!dropdownRef.current?.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    const clearAndRedirect = () => {
      localStorage.removeItem("roleName");
      localStorage.removeItem("user");

      queryClient.clear();
      toast.success("Đăng xuất thành công!");

      setTimeout(() => {
        window.location.href = "/";
      }, 500);
    };

    logoutMutate(undefined, {
      onSettled: () => clearAndRedirect(),
    });
  };

  return (
    <>
      <header className="bg-white dark:bg-gray-900 shadow-sm dark:border-b dark:border-gray-800 sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-32 h-10" onClick={() => navigate("/")}>
              <img src="/slogan.png" alt="Staylio" />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="hover:text-[#0066FF] dark:text-gray-200 dark:hover:text-[#0066FF]">
                Trang chủ
              </a>

              {/* Khách sạn Dropdown */}
              <div className="relative group py-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-[#0066FF] dark:text-gray-200 dark:hover:text-[#0066FF]">
                  Khách sạn
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </div>
                <div className="absolute top-full left-0 mt-0 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 p-2 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <div className="max-h-80 overflow-y-auto">
                    {hotelsData?.filter((h: HotelResponse) => h.status === HotelStatus.CONFIRMED).map((hotel: HotelResponse) => (
                      <div key={hotel.id} onClick={() => navigate(`/hotel/${hotel.id}`)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-8 h-8 rounded-md object-cover" />
                        <span className="text-sm font-medium dark:text-gray-200">{hotel.name}</span>
                      </div>
                    ))}
                    {(!hotelsData || hotelsData.filter((h: HotelResponse) => h.status === HotelStatus.CONFIRMED).length === 0) && (
                      <div className="px-3 py-2 text-sm text-gray-500">Không có dữ liệu</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Điểm đến Dropdown */}
              <div className="relative group py-4">
                <div className="flex items-center gap-1 cursor-pointer hover:text-[#0066FF] dark:text-gray-200 dark:hover:text-[#0066FF]">
                  Điểm đến
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </div>
                <div className="absolute top-full left-0 mt-0 w-64 bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 p-2 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity z-50">
                  <div className="max-h-80 overflow-y-auto">
                    {featuredLocations?.map((location: FeaturedLocationResponse) => (
                      <div key={location.provinceId} onClick={() => navigate(`/location/${location.provinceId}`)} className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors">
                        <img src={location.imageUrl || 'https://images.unsplash.com/photo-1596422846543-75c6ef08b739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'} alt={location.provinceName} className="w-8 h-8 rounded-md object-cover" />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-200">{location.provinceName}</p>
                          <p className="text-xs text-gray-500">{location.totalBranches} khách sạn</p>
                        </div>
                      </div>
                    ))}
                    {(!featuredLocations || featuredLocations.length === 0) && (
                      <div className="px-3 py-2 text-sm text-gray-500">Không có dữ liệu</div>
                    )}
                  </div>
                </div>
              </div>

              <a href="#" className="hover:text-[#0066FF] dark:text-gray-200 dark:hover:text-[#0066FF]">
                Ưu đãi
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              {user ? (
                <>
                  <NotificationPopover />
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <img
                        src={user.avatarUrl}
                        className="w-9 h-9 rounded-full object-cover"
                      />
                      <span className="font-medium hidden md:block">
                        {user.fullName}
                      </span>
                    </div>

                    {open && (
                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-xl shadow-lg border dark:border-gray-800 p-2">
                        <div className="px-3 py-2 border-b dark:border-gray-800">
                          <p className="font-medium dark:text-gray-200">{user.fullName}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>

                        <button
                          onClick={() => navigate("/profile/me")}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                        >
                          <User size={18} />
                          Thông tin cá nhân
                        </button>

                        <button
                          onClick={() => navigate("/booking-history")}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                        >
                          <History size={18} />
                          Lịch sử đặt phòng
                        </button>

                        <button
                          onClick={() => navigate("/favorites")}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg"
                        >
                          <Heart size={18} />
                          Yêu thích
                        </button>

                        <button
                          onClick={() => {
                            const newLang = (i18n.language || 'vi').startsWith('vi') ? 'en' : 'vi';
                            i18n.changeLanguage(newLang);
                            setOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-100 rounded-lg"
                        >
                          <div className="flex items-center gap-2 text-gray-700 dark:text-gray-200">
                            <Globe size={18} />
                            Ngôn ngữ
                          </div>
                          <span className="text-xs bg-gray-200 dark:bg-gray-700 dark:text-gray-200 px-2 py-1 rounded-md font-medium uppercase">
                            {(i18n.language || 'vi').substring(0, 2)}
                          </span>
                        </button>

                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                        >
                          <LogOut size={18} />
                          Đăng xuất
                        </button>
                      </div>
                    )}

                    <ConfirmLogoutModal
                      open={showLogoutModal}
                      onClose={() => setShowLogoutModal(false)}
                      onConfirm={handleLogout}
                    />
                  </div>
                </>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-200 rounded-lg"
                  >
                    Đăng nhập
                  </button>
                  <button
                    onClick={() => navigate("/register")}
                    className="px-4 py-2 bg-[#0066FF] text-white rounded-lg"
                  >
                    Đăng ký
                  </button>
                </>
              )}

              {/* Hamburger Menu Icon */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-gray-100">
              <nav className="flex flex-col gap-4">
                <a href="/" className="font-medium hover:text-[#0066FF]">
                  Trang chủ
                </a>
                
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-gray-900">Khách sạn</div>
                  <div className="flex flex-col gap-2 pl-4 max-h-48 overflow-y-auto">
                    {hotelsData?.filter((h: HotelResponse) => h.status === HotelStatus.CONFIRMED).map((hotel: HotelResponse) => (
                      <div key={hotel.id} onClick={() => { navigate(`/hotel/${hotel.id}`); setMobileMenuOpen(false); }} className="text-sm text-gray-600 hover:text-[#0066FF] cursor-pointer">
                        {hotel.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="font-medium text-gray-900">Điểm đến</div>
                  <div className="flex flex-col gap-2 pl-4 max-h-48 overflow-y-auto">
                    {featuredLocations?.map((location: FeaturedLocationResponse) => (
                      <div key={location.provinceId} onClick={() => { navigate(`/location/${location.provinceId}`); setMobileMenuOpen(false); }} className="text-sm text-gray-600 hover:text-[#0066FF] cursor-pointer">
                        {location.provinceName}
                      </div>
                    ))}
                  </div>
                </div>

                <a href="#" className="font-medium hover:text-[#0066FF]">
                  Ưu đãi
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
