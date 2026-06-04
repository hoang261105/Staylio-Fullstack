import { useNavigate } from "react-router";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  Heart,
  Lock,
} from "lucide-react";
import Header from "../layout/Header";
import { formatDate } from "../../../common/utils/formatDate";
import { useProfile } from "../../../common/hooks/useProfile";

export default function Profile() {
  const navigate = useNavigate();
  const { data: user } = useProfile();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-700">
      <Header />

      <div className="max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-100">
          Cài đặt tài khoản
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-2">
              <button
                onClick={() => navigate("/profile")}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-50 text-blue-600 font-medium shadow-sm"
              >
                <Settings size={20} />
                Thông tin cá nhân
              </button>

              <button
                onClick={() => navigate("/history-bookings")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:bg-gray-700/70 transition group"
              >
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 dark:text-gray-500 group-hover:text-gray-800 dark:text-gray-100">
                  <Calendar size={20} />
                  <span>Chuyến đi của tôi</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
              </button>

              <button
                onClick={() => navigate("/favorites")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:bg-gray-700/70 transition group"
              >
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 dark:text-gray-500 group-hover:text-gray-800 dark:text-gray-100">
                  <Heart size={20} />
                  <span>Khách sạn đã lưu</span>
                </div>
                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
              </button>

              <button
                onClick={() => navigate("/change-password")}
                className="w-full flex items-center justify-between px-4 py-3 rounded-xl hover:bg-gray-100 dark:bg-gray-700/70 transition group"
              >
                <div className="flex items-center gap-3 text-gray-500 dark:text-gray-400 dark:text-gray-500 group-hover:text-gray-800 dark:text-gray-100">
                  <Lock size={20} />
                  <span>Đổi mật khẩu</span>
                </div>

                <ChevronRight size={16} className="text-gray-400 dark:text-gray-500" />
              </button>
            </div>

            <button className="w-full flex items-center gap-3 px-6 py-4 bg-red-50/60 text-red-500 rounded-2xl font-medium hover:bg-red-100 transition">
              <LogOut size={20} />
              Đăng xuất
            </button>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-8">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-4">
                  <img
                    src={user?.avatarUrl}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                      {user?.fullName || "Nguyễn Văn A"}
                    </h2>
                    <p className="text-sm text-gray-400 dark:text-gray-500">
                      Thành viên từ 01/2026
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/profile/edit")}
                  className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 dark:bg-gray-700 transition"
                >
                  <Edit size={16} />
                  Thay đổi
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <InfoItem
                    icon={<Mail />}
                    label="Email"
                    value={user?.email || "nguyenvana@email.com"}
                  />
                  <InfoItem
                    icon={<Phone />}
                    label="Số điện thoại"
                    value={user?.phone || "Chưa có"}
                  />
                </div>

                <div className="space-y-6">
                  <InfoItem
                    icon={<Calendar />}
                    label="Ngày sinh"
                    value={formatDate(user?.dateOfBirth || "1990-01-01")}
                  />
                  <InfoItem
                    icon={<MapPin />}
                    label="Địa chỉ"
                    value={user?.address || "Chưa có"}
                  />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-md p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
                  Thanh toán
                </h3>
                <button className="text-sm text-blue-600 font-medium hover:underline">
                  Thêm mới
                </button>
              </div>

              <div className="p-4 rounded-xl border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                    VISA
                  </div>

                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-100">
                      •••• •••• •••• 4242
                    </p>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Hết hạn 12/28</p>
                  </div>
                </div>

                <span className="text-xs font-semibold text-blue-600 bg-white dark:bg-gray-800 px-2 py-1 rounded border border-gray-200 dark:border-gray-600 shadow-sm">
                  MẶC ĐỊNH
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-blue-500 mt-1">{icon}</div>
      <div>
        <p className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wide">{label}</p>
        <p className="font-medium text-gray-800 dark:text-gray-100">{value}</p>
      </div>
    </div>
  );
}
