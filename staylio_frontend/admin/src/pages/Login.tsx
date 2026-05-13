import { useNavigate } from "react-router";
import { Mail, Lock, Shield, ShieldCheck, BarChart3, Zap } from "lucide-react";
import { InputField } from "../../../common/components/InputField";
import { useLoginForm } from "../../../common/hooks/useLoginForm";

export default function AdminLogin() {
  const navigate = useNavigate();

  const { 
    formData, 
    setFormData, 
    isLoading, 
    fieldErrors,
    handleSubmit 
  } = useLoginForm((redirectPath) => {
    navigate(redirectPath);
  });

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#1B2B4D] to-[#0066FF] relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className=" rounded-xl w-52 inline-flex items-center justify-center mb-6">
            <img src="/slogan.png" alt="Staylio" />
          </div>

          <div className="max-w-md">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
              <Shield className="w-8 h-8" />
            </div>

            <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
              Quản trị viên
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Đăng nhập để truy cập bảng điều khiển quản trị và quản lý hệ thống
              STAYLIO.
            </p>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-medium">Bảo mật cao</div>
                  <div className="text-sm text-white/80">
                    Xác thực 2 lớp và mã hóa SSL
                  </div>
                </div>
              </div>

              {/* Item 2 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-medium">Quản lý toàn diện</div>
                  <div className="text-sm text-white/80">
                    Theo dõi và điều hành mọi hoạt động
                  </div>
                </div>
              </div>

              {/* Item 3 */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Zap size={20} className="text-white" />
                </div>
                <div>
                  <div className="font-medium">Hiệu suất cao</div>
                  <div className="text-sm text-white/80">
                    Dashboard nhanh chóng và responsive
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/60">
            © 2026 STAYLIO Admin Panel. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#0066FF]/10 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-[#0066FF]" />
              </div>
              <div>
                <h2 className="text-3xl">Admin Login</h2>
                <p className="text-sm text-muted-foreground">
                  Bảng điều khiển quản trị
                </p>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-start gap-2">
              <Shield className="w-4 h-4 text-yellow-600 shrink-0 mt-0.5" />
              <p className="text-xs text-yellow-800">
                Chỉ dành cho quản trị viên được ủy quyền. Mọi hoạt động đều được
                ghi lại.
              </p>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email quản trị"
              type="email"
              required
              icon={Mail}
              placeholder="admin@staylio.com"
              value={formData.email}
              error={fieldErrors.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <InputField
              label="Mật khẩu"
              type="password"
              required
              icon={Lock}
              placeholder="••••••••"
              value={formData.password}
              error={fieldErrors.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />

            {/* Forgot password */}
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={() => navigate("/forgot-password")}
                className="text-sm text-[#0066FF] hover:underline"
              >
                Quên mật khẩu?
              </button>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded border-border text-[#0066FF] focus:ring-[#0066FF]"
              />
              <label htmlFor="rememberMe" className="text-sm cursor-pointer">
                Ghi nhớ đăng nhập
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center justify-center gap-2"
            >
              <Shield size={18} />
              <span>{isLoading ? "Đang xác thực..." : "Đăng nhập Admin"}</span>
            </button>
          </form>

          {/* Security Notice */}
          <div className="mt-8 bg-accent/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <Lock className="w-4 h-4 text-red-600" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Cảnh báo bảo mật
                </p>
                <p>
                  Không chia sẻ thông tin đăng nhập của bạn với bất kỳ ai. Đăng
                  xuất khi sử dụng trên thiết bị công cộng.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
