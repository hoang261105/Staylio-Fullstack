/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import ConfirmLogoutModal from "../../../common/components/ConfirmLogoutModal";
import { Heart, History, LogOut, User } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useProfile } from "../../../common/hooks/useProfile";
import { useLogoutMutation } from "../../../common/hooks/useAuthMutation";

export default function Header() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: user } = useProfile();
  const [open, setOpen] = useState(false);
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
    const refreshToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("refreshToken="))
      ?.split("=")[1];

    const clearAndRedirect = () => {
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
        window.location.href = "/";
      }, 500);
    };

    if (refreshToken) {
      logoutMutate(refreshToken, {
        onSettled: () => clearAndRedirect(),
      });
    } else {
      clearAndRedirect();
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 w-32 h-10">
              <img src="/slogan.png" alt="Staylio" />
            </div>

            <nav className="hidden md:flex items-center gap-6">
              <a href="/" className="hover:text-[#0066FF]">
                Trang chủ
              </a>
              <a href="#" className="hover:text-[#0066FF]">
                Khách sạn
              </a>
              <a href="#" className="hover:text-[#0066FF]">
                Điểm đến
              </a>
              <a href="#" className="hover:text-[#0066FF]">
                Ưu đãi
              </a>
            </nav>

            <div className="flex items-center gap-3">
              {user ? (
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
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-lg border p-2">
                      <div className="px-3 py-2 border-b">
                        <p className="font-medium">{user.fullName}</p>
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
                        onClick={() => setShowLogoutModal(true)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut size={18} />
                        Đăng xuất
                      </button>

                      <ConfirmLogoutModal
                        open={showLogoutModal}
                        onClose={() => setShowLogoutModal(false)}
                        onConfirm={handleLogout}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <button
                    onClick={() => navigate("/login")}
                    className="px-4 py-2 hover:bg-gray-100 rounded-lg"
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
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
