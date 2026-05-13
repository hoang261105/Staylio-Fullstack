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
      <div className="min-h-screen flex">
        {/* Left Side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066FF] to-[#00C896] relative overflow-hidden">
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1772127822607-2343696cf82e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
              alt="Travel"
              className="w-full h-full object-cover opacity-30"
            />
          </div>

          <div className="relative z-10 flex flex-col justify-between p-12 text-white">
            <div className="bg-white px-4 py-3 rounded-xl inline-block w-fit">
              <Logo onClick={() => navigate("/")} size="lg" />
            </div>

            <div className="max-w-md">
              <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
                Hoàn tất!
              </h1>
              <p className="text-lg text-white/90">
                Mật khẩu của bạn đã được đặt lại thành công.
              </p>
            </div>

            <div className="text-sm text-white/60">
              © 2026 STAYLIO. All rights reserved.
            </div>
          </div>
        </div>

        {/* Right Side - Success Message */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
          <div className="w-full max-w-md text-center">
            <div className="lg:hidden mb-8">
              <Logo onClick={() => navigate("/")} size="md" />
            </div>

            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>

            <h2 className="text-3xl mb-3">Đặt lại mật khẩu thành công!</h2>
            <p className="text-muted-foreground mb-8">
              Bạn có thể đăng nhập bằng mật khẩu mới ngay bây giờ.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors mb-4"
            >
              Đăng nhập ngay
            </button>

            <button
              onClick={() => navigate("/")}
              className="w-full py-3 border-2 border-border rounded-lg hover:bg-accent transition-colors"
            >
              Về trang chủ
            </button>

            <div className="mt-8 bg-accent/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                💡 <span className="font-medium text-foreground">Mẹo:</span> Hãy
                lưu mật khẩu mới của bạn ở nơi an toàn hoặc sử dụng trình quản
                lý mật khẩu.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <ResetPassSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo onClick={() => navigate("/")} size="md" />
          </div>

          <div className="mb-8">
            <h2 className="text-3xl mb-2">Đặt lại mật khẩu</h2>
            <p className="text-muted-foreground">
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
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    {[1, 2, 3].map((level) => (
                      <div
                        key={level}
                        className={`h-1 flex-1 rounded-full ${
                          level <= passwordStrength.strength
                            ? passwordStrength.color
                            : "bg-muted"
                        }`}
                      />
                    ))}
                  </div>

                  {passwordStrength.label && (
                    <p className="text-xs text-muted-foreground">
                      Độ mạnh: {passwordStrength.label}
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

            <div className="bg-accent/50 rounded-lg p-4">
              <h3 className="text-sm font-medium mb-2">
                Mật khẩu phải đáp ứng:
              </h3>

              <ul className="text-xs text-muted-foreground space-y-1">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      formData.newPassword.length >= 8
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  Ít nhất 8 ký tự
                </li>

                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      /[A-Z]/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  Có chữ in hoa
                </li>

                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      /[a-z]/.test(formData.newPassword)
                        ? "bg-green-500"
                        : "bg-gray-300"
                    }`}
                  />
                  Có chữ thường
                </li>

                <li className="flex items-center gap-2">
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      /[0-9]/.test(formData.newPassword)
                        ? "bg-green-500"
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
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isPending ? "Đang đặt lại..." : "Đặt lại mật khẩu"}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nhớ mật khẩu rồi?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-[#0066FF] hover:underline cursor-pointer font-medium"
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
