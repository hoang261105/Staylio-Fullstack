import { useState } from "react";
import { useNavigate } from "react-router";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  PartyPopper,
  Gem,
  Smartphone,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
    subscribe: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.userName.trim()) {
      newErrors.userName = "Vui lòng nhập tên đăng nhập";
    }

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên";
    }

    if (!formData.gender) {
      newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      navigate("/");
    }, 1500);
  };

  const handleSocialRegister = (provider: string) => {
    console.log(`Register with ${provider}`);
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 1, label: "Yếu", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 2, label: "Trung bình", color: "bg-yellow-500" };
    return { strength: 3, label: "Mạnh", color: "bg-green-500" };
  };

  const passwordStrength = getPasswordStrength();

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
          <div className=" rounded-xl w-52 inline-flex items-center justify-center mb-6">
            <img
              src="/slogan.png"
              alt="Staylio"
              // className="h-6 w-auto object-contain"
            />
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
              Bắt đầu hành trình của bạn
            </h1>
            <p className="text-lg text-white/90 mb-8">
              Tham gia cộng đồng hơn 2.5 triệu người dùng đang khám phá thế giới
              cùng Staylio.
            </p>

            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <PartyPopper className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Giảm 10% đơn đầu</div>
                  <div className="text-sm text-white/80">
                    Cho thành viên mới
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Gem className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Tích điểm thưởng</div>
                  <div className="text-sm text-white/80">
                    Đổi ưu đãi hấp dẫn
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center shrink-0">
                  <Smartphone className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-medium">Hỗ trợ 24/7</div>
                  <div className="text-sm text-white/80">
                    Luôn sẵn sàng giúp đỡ
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
            <h2 className="text-3xl mb-2">Tạo tài khoản</h2>
            <p className="text-muted-foreground">
              Đã có tài khoản?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-[#0066FF] hover:underline cursor-pointer font-medium"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>

          {/* Social Register */}
          <div className="space-y-3 mb-6">
            <button
              onClick={() => handleSocialRegister("google")}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-border rounded-lg hover:bg-accent transition-colors"
            >
              <FaGoogle className="w-5 h-5" />
              <span>Tiếp tục với Google</span>
            </button>
          </div>

          <div className="flex items-center mb-6">
            <div className="flex-1 h-px bg-gray-300"></div>

            <span className="px-4 text-sm text-gray-500 whitespace-nowrap">
              Hoặc đăng ký với email
            </span>

            <div className="flex-1 h-px bg-gray-300"></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="block text-sm mb-2">
              <div>
                <label className="block text-sm mb-2">
                  Tên đăng nhập <span className="text-destructive text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.userName}
                    onChange={(e) =>
                      setFormData({ ...formData, userName: e.target.value })
                    }
                    className={`w-full px-4 py-3 pl-11 border-2 ${
                      errors.userName ? "border-destructive" : "border-border"
                    } rounded-lg`}
                    placeholder="username123"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                </div>
                {errors.userName && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.userName}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm mb-2">
                Họ và tên <span className="text-destructive text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className={`w-full px-4 py-3 pl-11 border-2 ${
                    errors.fullName ? "border-destructive" : "border-border"
                  } rounded-lg`}
                  placeholder="Nguyễn Văn A"
                />
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {errors.fullName && (
                <p className="text-xs text-destructive mt-1">
                  {errors.fullName}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                Giới tính <span className="text-destructive text-red-500">*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData({ ...formData, gender: e.target.value })
                }
                className={`w-full px-4 py-3 border-2 ${
                  errors.gender ? "border-destructive" : "border-border"
                } rounded-lg`}
              >
                <option value="">Chọn giới tính</option>
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && (
                <p className="text-xs text-destructive mt-1">{errors.gender}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                Ngày sinh <span className="text-destructive text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.dateOfBirth}
                onChange={(e) =>
                  setFormData({ ...formData, dateOfBirth: e.target.value })
                }
                className={`w-full px-4 py-3 border-2 ${
                  errors.dateOfBirth ? "border-destructive" : "border-border"
                } rounded-lg`}
              />
              {errors.dateOfBirth && (
                <p className="text-xs text-destructive mt-1">
                  {errors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                Email <span className="text-destructive text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className={`w-full px-4 py-3 pl-11 border-2 ${
                    errors.email ? "border-destructive" : "border-border"
                  } rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors`}
                  placeholder="email@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                Mật khẩu <span className="text-destructive text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className={`w-full px-4 py-3 pl-11 pr-11 border-2 ${
                    errors.password ? "border-destructive" : "border-border"
                  } rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors`}
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
              {formData.password && (
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
              {errors.password && (
                <p className="text-xs text-destructive mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-2">
                Xác nhận mật khẩu <span className="text-destructive text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  className={`w-full px-4 py-3 pl-11 pr-11 border-2 ${
                    errors.confirmPassword
                      ? "border-destructive"
                      : "border-border"
                  } rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors`}
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="space-y-3">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={(e) =>
                    setFormData({ ...formData, agreeToTerms: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 rounded border-border text-[#0066FF] focus:ring-[#0066FF]"
                />
                <label
                  htmlFor="agreeToTerms"
                  className="ml-2 text-sm cursor-pointer"
                >
                  Tôi đồng ý với{" "}
                  <a href="#" className="text-[#0066FF] hover:underline">
                    Điều khoản dịch vụ
                  </a>{" "}
                  và{" "}
                  <a href="#" className="text-[#0066FF] hover:underline">
                    Chính sách bảo mật
                  </a>
                  <span className="text-destructive">*</span>
                </label>
              </div>
              {errors.agreeToTerms && (
                <p className="text-xs text-destructive">
                  {errors.agreeToTerms}
                </p>
              )}

              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="subscribe"
                  checked={formData.subscribe}
                  onChange={(e) =>
                    setFormData({ ...formData, subscribe: e.target.checked })
                  }
                  className="w-4 h-4 mt-0.5 rounded border-border text-[#0066FF] focus:ring-[#0066FF]"
                />
                <label
                  htmlFor="subscribe"
                  className="ml-2 text-sm cursor-pointer text-muted-foreground"
                >
                  Nhận email về ưu đãi và tin tức mới nhất
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Đã có tài khoản?{" "}
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
  );
}
