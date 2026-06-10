import Logo from "../components/Logo";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../../common/components/ui/button";

interface VerifyResetEmailProps {
    email: string;
    setIsSubmitted: (isSubmitted: boolean) => void;
}

export default function VerifyResetEmail({ email, setIsSubmitted }: VerifyResetEmailProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex bg-background font-sans">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden group bg-slate-900">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover opacity-50 scale-100 group-hover:scale-105 transition-transform duration-[10000ms] ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-blue-900/60 to-emerald-900/80 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-16 text-white h-full w-full">
          <div className="bg-white dark:bg-gray-800/10 backdrop-blur-md rounded-2xl w-48 p-4 inline-flex items-center justify-center mb-6 shadow-xl border border-white/20">
            <img src="/slogan.png" alt="Staylio" className="brightness-0 invert" />
          </div>

          <div className="max-w-md mt-auto mb-20">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight drop-shadow-md">
              Kiểm tra <span className="text-emerald-300">email</span> của bạn
            </h1>
            <p className="text-lg text-white/90 mb-10 font-medium leading-relaxed drop-shadow-sm">
              Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn.
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

        <div className="w-full max-w-[440px] bg-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-border relative z-10 text-center">
          <div className="lg:hidden mb-8 flex justify-center">
            <Logo onClick={() => navigate("/")} size="md" />
          </div>

          <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
            <CheckCircle className="w-12 h-12 text-emerald-600" />
          </div>

          <h2 className="text-3xl font-bold mb-3 text-card-foreground">Email đã được gửi!</h2>
          <p className="text-muted-foreground mb-2 leading-relaxed">
            Chúng tôi đã gửi link khôi phục mật khẩu đến
          </p>
          <p className="font-bold text-primary text-lg mb-8">{email}</p>

          <div className="bg-primary/5 rounded-2xl p-6 mb-8 text-left border border-primary/10">
            <h3 className="font-bold text-card-foreground mb-4">Bước tiếp theo:</h3>
            <ol className="space-y-3 text-sm text-muted-foreground font-medium">
              <li className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">1</span>
                <span>Kiểm tra hộp thư đến (hoặc spam)</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">2</span>
                <span>Nhấp vào link trong email</span>
              </li>
              <li className="flex gap-3 items-center">
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">3</span>
                <span>Tạo mật khẩu mới</span>
              </li>
            </ol>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/login")}
              className="w-full py-6 text-lg font-semibold rounded-xl"
            >
              Quay lại đăng nhập
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsSubmitted(false)}
              className="w-full py-6 text-lg font-semibold rounded-xl"
            >
              Gửi lại email
            </Button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Không nhận được email?{" "}
            <a href="#" className="text-primary hover:text-primary/80 hover:underline font-semibold transition-colors">
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
