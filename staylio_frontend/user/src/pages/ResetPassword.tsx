/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Lock, CheckCircle } from "lucide-react";
import Logo from "../components/Logo";
import type { NewPasswordRequest } from "../../../common/interfaces";
import { useResetPasswordMutation } from "../../../common/hooks/useChangePassword";
import { useSearchParams } from "react-router-dom";
import ResetPassSideBar from "../components/ResetPassSideBar";
import toast from "react-hot-toast";
import { InputField } from "../../../common/components/InputField";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") || "";
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState<NewPasswordRequest>({
    newPassword: "",
    confirmNewPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { mutateAsync, isPending } = useResetPasswordMutation(() =>
    navigate("/reset-password?success=true"),
  );

  const getPasswordStrength = () => {
    const password = formData.newPassword;
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 1, label: "Yếu", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 2, label: "Trung bình", color: "bg-yellow-500" };
    return { strength: 3, label: "Mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    try {
      await mutateAsync({ token, newPasswordRequest: formData });
      setIsSuccess(true);
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;

      if (apiErrors) {
        const fieldErrors: Record<string, string> = {};

        apiErrors.forEach((err: any) => {
            fieldErrors[err.field] = err.message;
        });

        setErrors(fieldErrors);
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    }

    
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex bg-slate-50 font-sans">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group bg-slate-900">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Travel"
              className="w-full h-full object-cover opacity-50 scale-100 group-hover:scale-105 transition-transform duration-[10000ms] ease-out"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-900/60 to-emerald-900/80 backdrop-blur-[2px]"></div>
          </div>

          <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full w-full">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl w-48 p-4 inline-flex items-center justify-center mb-6 shadow-xl border border-white/20">
              <img src="/slogan.png" alt="Staylio" className="brightness-0 invert" />
            </div>

            <div className="max-w-md mt-auto mb-20">
              <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-md">
                Hoàn <span className="text-emerald-300">tất!</span>
              </h1>
              <p className="text-lg text-white/90 mb-10 font-medium leading-relaxed drop-shadow-sm">
                Mật khẩu của bạn đã được đặt lại thành công.
              </p>
            </div>

            <div className="text-sm text-white/50 font-medium">
              © 2026 STAYLIO. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>

          <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10 text-center">
            <div className="lg:hidden mb-8 flex justify-center">
              <Logo onClick={() => navigate("/")} size="md" />
            </div>

            <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
              <CheckCircle className="w-12 h-12 text-emerald-600" />
            </div>

            <h2 className="text-3xl font-bold mb-3 text-gray-900">Thành công!</h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98] mb-4"
            >
              Đăng nhập ngay
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-lg text-gray-700 active:scale-[0.98]"
            >
              Về trang chủ
            </button>

            <div className="mt-8 bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50 text-left">
              <p className="text-sm text-gray-600 leading-relaxed">
                <span className="font-bold text-gray-900 mb-1 block">💡 Mẹo bảo mật</span>
                Hãy lưu mật khẩu mới của bạn ở nơi an toàn hoặc sử dụng trình quản lý mật khẩu.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <ResetPassSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>

        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo onClick={() => navigate("/")} size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-gray-900">Đặt lại mật khẩu</h2>
            <p className="text-gray-500">
              Tạo mật khẩu mới cho tài khoản của bạn
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <InputField
                label="Mật khẩu mới"
                type="password"
                required
                icon={Lock}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                error={errors.newPassword}
                placeholder="••••••••"
              />

              {formData.newPassword && (
                <div className="mt-2.5">
                  <div className="flex gap-1.5 mb-1.5">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-gray-200"
                        }`}
                      />
                    ))}
                  </div>

                  {passwordStrength.label && (
                    <p className="text-xs text-gray-500 font-medium">
                      Độ mạnh: <span className={passwordStrength.color.replace('bg-', 'text-')}>{passwordStrength.label}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            <InputField
              label="Xác nhận mật khẩu mới"
              type="password"
              required
              icon={Lock}
              value={formData.confirmNewPassword}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  confirmNewPassword: e.target.value,
                })
              }
              error={errors.confirmNewPassword}
              placeholder="••••••••"
            />

            <div className="bg-blue-50/50 rounded-2xl p-5 border border-blue-100/50">
              <h3 className="text-sm font-bold text-gray-900 mb-3">
                Mật khẩu phải đáp ứng:
              </h3>

              <ul className="text-sm text-gray-600 space-y-2 font-medium">
                <li className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      formData.newPassword.length >= 8
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : "bg-gray-300"
                    }`}
                  />
                  Ít nhất 8 ký tự
                </li>

                <li className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      /[A-Z]/.test(formData.newPassword)
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : "bg-gray-300"
                    }`}
                  />
                  Có chữ in hoa
                </li>

                <li className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      /[a-z]/.test(formData.newPassword)
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : "bg-gray-300"
                    }`}
                  />
                  Có chữ thường
                </li>

                <li className="flex items-center gap-3">
                  <div
                    className={`w-2 h-2 rounded-full transition-colors ${
                      /[0-9]/.test(formData.newPassword)
                        ? "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]"
                        : "bg-gray-300"
                    }`}
                  />
                  Có số
                </li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98]"
            >
              {isPending ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Nhớ mật khẩu rồi?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-semibold transition-colors"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
