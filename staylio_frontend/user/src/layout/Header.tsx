/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation, Link } from "react-router-dom";
import ConfirmLogoutModal from "../../../common/components/ConfirmLogoutModal";
import NotificationPopover from "../../../common/components/NotificationPopover";
import { History, LogOut, User, Menu, X, Sun, Moon, Globe } from "lucide-react";
import { useTheme } from "../components/ThemeProvider";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../../common/hooks/useProfile";
import { useLogoutMutation } from "../../../common/hooks/useAuthMutation";
import { Button } from "../../../common/components/ui/button";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { theme, setTheme } = useTheme();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };
  const { t, i18n } = useTranslation();

  const { data: user } = useProfile();
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
              <Link to="/" className={`transition-colors ${isActive('/') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>
                {t('components.header.home')}
              </Link>

              <Link to="/hotels" className={`transition-colors ${isActive('/hotels') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>
                {t('components.header.hotels')}
              </Link>

              <Link to="/locations" className={`transition-colors ${isActive('/locations') ? 'text-primary font-semibold' : 'text-foreground hover:text-primary'}`}>
                {t('components.header.destinations')}
              </Link>

              <Link to="#" className="text-foreground hover:text-primary transition-colors">
                {t('components.header.offers')}
              </Link>
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
                <Link to="/" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${isActive('/') ? 'text-primary font-bold' : 'font-medium text-foreground hover:text-primary'}`}>
                  {t('components.header.home')}
                </Link>

                <Link to="/hotels" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${isActive('/hotels') ? 'text-primary font-bold' : 'font-medium text-foreground hover:text-primary'}`}>
                  {t('components.header.hotels')}
                </Link>

                <Link to="/locations" onClick={() => setMobileMenuOpen(false)} className={`transition-colors ${isActive('/locations') ? 'text-primary font-bold' : 'font-medium text-foreground hover:text-primary'}`}>
                  {t('components.header.destinations')}
                </Link>

                <Link to="#" onClick={() => setMobileMenuOpen(false)} className="font-medium text-foreground hover:text-primary transition-colors">
                  {t('components.header.offers')}
                </Link>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
}
