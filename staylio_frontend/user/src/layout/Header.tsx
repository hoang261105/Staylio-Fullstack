/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "../../../common/components/ConfirmLogoutModal";
import NotificationPopover from "../../../common/components/NotificationPopover";
import { History, LogOut, User, ChevronDown, Menu, X, Sun, Moon, Globe } from "lucide-react";
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
import { Button } from "../../../common/components/ui/button";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const { data: user } = useProfile();
  const { data: hotelsData } = useAllHotels();
  const { data: featuredLocations } = useFeaturedProvinces();
  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const { mutate: logoutMutate, isPending: isLoggingOut } = useLogoutMutation();

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
      toast.success(t('components.header.logoutSuccess'));

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
      <header className="bg-background shadow-sm border-b border-border sticky top-0 z-50 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-32 h-10 cursor-pointer" onClick={() => navigate("/")}>
              <img src="/slogan.png" alt="Staylio" className="dark:brightness-0 dark:invert" />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="text-foreground hover:text-primary transition-colors">
                {t('components.header.home')}
              </a>

              {/* Khách sạn Dropdown */}
              <div className="relative group py-4">
                <div className="flex items-center gap-1 cursor-pointer text-foreground hover:text-primary transition-colors">
                  {t('components.header.hotels')}
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </div>
                <div className="absolute top-full left-0 mt-0 w-64 bg-popover rounded-xl shadow-lg border border-border p-2 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity z-50 text-popover-foreground">
                  <div className="max-h-80 overflow-y-auto">
                    {hotelsData?.filter((h: HotelResponse) => h.status === HotelStatus.CONFIRMED).map((hotel: HotelResponse) => (
                      <div key={hotel.id} onClick={() => navigate(`/hotel/${hotel.id}`)} className="flex items-center gap-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg cursor-pointer transition-colors">
                        <img src={hotel.imageUrl} alt={hotel.name} className="w-8 h-8 rounded-md object-cover" />
                        <span className="text-sm font-medium">{hotel.name}</span>
                      </div>
                    ))}
                    {(!hotelsData || hotelsData.filter((h: HotelResponse) => h.status === HotelStatus.CONFIRMED).length === 0) && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">{t('components.header.noData')}</div>
                    )}
                  </div>
                </div>
              </div>

              {/* Điểm đến Dropdown */}
              <div className="relative group py-4">
                <div className="flex items-center gap-1 cursor-pointer text-foreground hover:text-primary transition-colors">
                  {t('components.header.destinations')}
                  <ChevronDown className="w-4 h-4 group-hover:rotate-180 transition-transform" />
                </div>
                <div className="absolute top-full left-0 mt-0 w-64 bg-popover rounded-xl shadow-lg border border-border p-2 hidden group-hover:block opacity-0 group-hover:opacity-100 transition-opacity z-50 text-popover-foreground">
                  <div className="max-h-80 overflow-y-auto">
                    {featuredLocations?.map((location: FeaturedLocationResponse) => (
                      <div key={location.provinceId} onClick={() => navigate(`/location/${location.provinceId}`)} className="flex items-center gap-3 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg cursor-pointer transition-colors">
                        <img src={location.imageUrl || 'https://images.unsplash.com/photo-1596422846543-75c6ef08b739?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=100'} alt={location.provinceName} className="w-8 h-8 rounded-md object-cover" />
                        <div>
                          <p className="text-sm font-medium">{location.provinceName}</p>
                          <p className="text-xs text-muted-foreground">{location.totalBranches} {t('components.header.hotelsCount')}</p>
                        </div>
                      </div>
                    ))}
                    {(!featuredLocations || featuredLocations.length === 0) && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">{t('components.header.noData')}</div>
                    )}
                  </div>
                </div>
              </div>

              <a href="#" className="text-foreground hover:text-primary transition-colors">
                {t('components.header.offers')}
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="rounded-full"
                aria-label="Toggle Dark Mode"
              >
                {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
              </Button>
              {user ? (
                <>
                  <NotificationPopover />
                  <div className="relative" ref={dropdownRef}>
                    <div
                      onClick={() => setOpen(!open)}
                      className="flex items-center gap-2 cursor-pointer text-foreground"
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
                      <div className="absolute right-0 mt-3 w-56 bg-popover text-popover-foreground rounded-xl shadow-lg border border-border p-2 z-50">
                        <div className="px-3 py-2 border-b border-border mb-1">
                          <p className="font-medium truncate" title={user.fullName}>{user.fullName}</p>
                          <p className="text-sm text-muted-foreground truncate" title={user.email}>{user.email}</p>
                        </div>

                        <button
                          onClick={() => navigate("/profile/me")}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                        >
                          <User size={18} />
                          {t('components.header.profile')}
                        </button>

                        <button
                          onClick={() => navigate("/booking-history")}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                        >
                          <History size={18} />
                          {t('components.header.bookingHistory')}
                        </button>

                        <button
                          onClick={() => {
                            const newLang = (i18n.language || 'vi').startsWith('vi') ? 'en' : 'vi';
                            i18n.changeLanguage(newLang);
                            setOpen(false);
                          }}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-accent hover:text-accent-foreground rounded-lg transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <Globe size={18} />
                            {t('components.header.language')}
                          </div>
                          <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-md font-medium uppercase">
                            {(i18n.language || 'vi').substring(0, 2)}
                          </span>
                        </button>

                        <button
                          onClick={() => setShowLogoutModal(true)}
                          className="w-full flex items-center gap-2 px-3 py-2 mt-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        >
                          <LogOut size={18} />
                          {t('components.header.logout')}
                        </button>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    onClick={() => navigate("/login")}
                  >
                    {t('components.header.login')}
                  </Button>
                  <Button
                    onClick={() => navigate("/register")}
                  >
                    {t('components.header.register')}
                  </Button>
                </>
              )}

              <ConfirmLogoutModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleLogout}
                isLoading={isLoggingOut}
              />

              {/* Hamburger Menu Icon */}
              <Button 
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {mobileMenuOpen && (
            <div className="md:hidden mt-4 pt-4 border-t border-border">
              <nav className="flex flex-col gap-4">
                <a href="/" className="font-medium text-foreground hover:text-primary transition-colors">
                  {t('components.header.home')}
                </a>
                
                <div className="flex flex-col gap-2">
                  <div className="font-medium text-foreground">{t('components.header.hotels')}</div>
                  <div className="flex flex-col gap-2 pl-4 max-h-48 overflow-y-auto">
                    {hotelsData?.filter((h: HotelResponse) => h.status === HotelStatus.CONFIRMED).map((hotel: HotelResponse) => (
                      <div key={hotel.id} onClick={() => { navigate(`/hotel/${hotel.id}`); setMobileMenuOpen(false); }} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                        {hotel.name}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <div className="font-medium text-foreground">{t('components.header.destinations')}</div>
                  <div className="flex flex-col gap-2 pl-4 max-h-48 overflow-y-auto">
                    {featuredLocations?.map((location: FeaturedLocationResponse) => (
                      <div key={location.provinceId} onClick={() => { navigate(`/location/${location.provinceId}`); setMobileMenuOpen(false); }} className="text-sm text-muted-foreground hover:text-primary cursor-pointer transition-colors">
                        {location.provinceName}
                      </div>
                    ))}
                  </div>
                </div>

                <a href="#" className="font-medium text-foreground hover:text-primary transition-colors">
                  {t('components.header.offers')}
                </a>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
