/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Lock } from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { InputField } from "../../../common/components/InputField";

export default function LoginForm({
  formData,
  setFormData,
  rememberMe,
  setRememberMe,
  fieldErrors,
  isLoading,
  onSubmit,
}: any) {
  const navigate = useNavigate();
  return (
    <>
      <div className="lg:hidden mb-8">
        <img src="/slogan.png" alt="Staylio" />
      </div>

      <div className="mb-8">
        <h2 className="text-3xl mb-2">Đăng nhập</h2>
        <p className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-[#0066FF] hover:underline cursor-pointer font-medium"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>

      <div className="space-y-3 mb-6">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 rounded-lg hover:bg-accent transition-colors">
          <FaGoogle className="w-5 h-5" />
          <span>Tiếp tục với Google</span>
        </button>
      </div>

      <div className="flex items-center mb-6">
        <div className="flex-1 h-px bg-gray-300"></div>

        <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
          Hoặc đăng nhập với email
        </span>

        <div className="flex-1 h-px bg-gray-300"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <InputField
          label="Email"
          type="email"
          required
          icon={Mail}
          placeholder="email@example.com"
          value={formData.email}
          error={fieldErrors.email}
          onChange={(e: any) =>
            setFormData({ ...formData, email: e.target.value })
          }
        />

        <InputField
          type="password"
          required
          icon={Lock}
          placeholder="••••••••"
          value={formData.password}
          error={fieldErrors.password}
          onChange={(e: any) =>
            setFormData({ ...formData, password: e.target.value })
          }
          label={"Mật khẩu"}
        />
        <div className="flex items-center justify-between mb-2">
          <a
            href="/forgot-password"
            className="text-sm text-[#0066FF] hover:underline"
          >
            Quên mật khẩu?
          </a>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-border text-[#0066FF] focus:ring-[#0066FF]"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm cursor-pointer">
            Ghi nhớ đăng nhập
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-8 text-center text-sm text-muted-foreground">
        Bằng cách đăng nhập, bạn đồng ý với{" "}
        <a href="#" className="text-[#0066FF] hover:underline">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-[#0066FF] hover:underline">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </p>
    </>
  );
}
