/* eslint-disable @typescript-eslint/no-explicit-any */
import { Mail, Lock } from "lucide-react";
import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from "react-router-dom";
import { InputField } from "../../../common/components/InputField";
import toast from "react-hot-toast";
import { Button } from "../../../common/components/ui/button";

export default function LoginForm({
  formData,
  setFormData,
  rememberMe,
  setRememberMe,
  fieldErrors,
  isLoading,
  onSubmit,
  onGoogleLogin,
}: any) {
  const navigate = useNavigate();
  return (
    <>
      <div className="lg:hidden mb-8 flex justify-center">
        <img src="/slogan.png" alt="Staylio" className="h-10 w-auto" />
      </div>

      <div className="mb-10 text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-3 text-foreground">Đăng nhập</h2>
        <p className="text-muted-foreground">
          Chưa có tài khoản?{" "}
          <a
            onClick={() => navigate("/register")}
            className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-semibold transition-colors"
          >
            Đăng ký ngay
          </a>
        </p>
      </div>

      <div className="flex justify-center w-full mb-8">
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            if (credentialResponse.credential) {
              onGoogleLogin(credentialResponse.credential);
            }
          }}
          onError={() => {
            toast.error("Đăng nhập Google thất bại");
          }}
          useOneTap
        />
      </div>

      <div className="flex items-center mb-8">
        <div className="flex-1 h-px bg-border"></div>
        <span className="px-4 text-sm text-muted-foreground font-medium whitespace-nowrap">
          Hoặc đăng nhập với email
        </span>
        <div className="flex-1 h-px bg-border"></div>
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
              className="text-sm text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
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
            className="w-4 h-4 rounded border-input text-primary focus:ring-primary cursor-pointer"
          />
          <label htmlFor="rememberMe" className="ml-2 text-sm text-muted-foreground cursor-pointer select-none">
            Ghi nhớ đăng nhập
          </label>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full py-6 mt-4 text-lg font-semibold rounded-xl"
        >
          {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
        </Button>
      </form>

      <p className="mt-10 text-center text-sm text-muted-foreground leading-relaxed">
        Bằng cách đăng nhập, bạn đồng ý với{" "}
        <a href="#" className="text-primary hover:underline font-medium">
          Điều khoản dịch vụ
        </a>{" "}
        và{" "}
        <a href="#" className="text-primary hover:underline font-medium">
          Chính sách bảo mật
        </a>{" "}
        của chúng tôi.
      </p>
    </>
  );
}
