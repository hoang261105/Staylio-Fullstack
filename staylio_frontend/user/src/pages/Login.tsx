import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  Sparkles,
  Gift,
  ShieldCheck,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066FF] to-[#00C896] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1568727174680-7ae330b15345?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className=" rounded-xl w-52 inline-flex items-center justify-center mb-6">
            <img
              src="/slogan.png"
              alt="Staylio"
              // className="h-6 w-auto object-contain"
            />
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
              Chào mừng trở lại!
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Tiếp tục khám phá và đặt phòng tại những khách sạn tuyệt vời trên
              khắp thế giới.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Giá tốt nhất</div>
                  <div className="text-sm text-white/80">
                    Đảm bảo giá thấp nhất
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Ưu đãi độc quyền</div>
                  <div className="text-sm text-white/80">
                    Giảm giá đến 30% cho thành viên
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Thanh toán an toàn</div>
                  <div className="text-sm text-white/80">
                    Bảo mật SSL 256-bit
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-sm text-white/60">
            © 2026 STAYLIO. All rights reserved.
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
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

          {/* Social Login */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialLogin("google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-lg hover:bg-accent transition-colors"
            >
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

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm mb-2">Email</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 border-2 border-border rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                  placeholder="email@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm">Mật khẩu</label>
                <a href="#" className="text-sm text-[#0066FF] hover:underline">
                  Quên mật khẩu?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 pl-11 pr-11 border-2 border-border rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                checked={formData.rememberMe}
                onChange={(e) =>
                  setFormData({ ...formData, rememberMe: e.target.checked })
                }
                className="w-4 h-4 rounded border-border text-[#0066FF] focus:ring-[#0066FF]"
              />
              <label
                htmlFor="rememberMe"
                className="ml-2 text-sm cursor-pointer"
              >
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
        </div>
      </div>
    </div>
  );
}
