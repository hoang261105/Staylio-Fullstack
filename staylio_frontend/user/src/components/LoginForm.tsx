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
      <div className="lg:hidden mb-8 flex justify-center">
        <img src="/slogan.png" alt="Staylio" className="h-10 w-auto" />
      </div>

      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Đăng nhập</h2>
        <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
          Chưa có tài khoản?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-semibold transition-colors"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>

      <div className="space-y-4 mb-8">
        <button className="w-full flex items-center justify-center gap-3 px-4 py-3.5 border border-gray-300 rounded-xl hover:bg-gray-50 dark:bg-gray-700 hover:border-gray-400 transition-all shadow-sm font-medium text-gray-700 dark:text-gray-200 active:scale-[0.98]">
          <FaGoogle className="w-5 h-5 text-red-500" />
          <span>Tiếp tục với Google</span>
        </button>
      </div>

      <div className="flex items-center mb-8">
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
        <span className="px-4 text-sm text-gray-400 dark:text-gray-500 font-medium whitespace-nowrap">
          Hoặc đăng nhập với email
        </span>
        <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600"></div>
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
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

        <div className="space-y-1">
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
          <div className="flex justify-end pt-1">
            <a
              href="/forgot-password"
              className="text-sm text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors"
            >
              Quên mật khẩu?
            </a>
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input
            type="checkbox"
            id="rememberMe"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 dark:text-gray-300 cursor-pointer select-none">
            Ghi nhớ đăng nhập
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 disabled:cursor-not-allowed font-semibold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98] mt-4"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>

      <p className="mt-10 text-center text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500 leading-relaxed">
        Bằng cách đăng nhập, bạn đồng ý với{" "}
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-blue-600 hover:underline font-medium">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </p>
    </>
  );
}
