import Logo from "../components/Logo";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface VerifyResetEmailProps {
    email: string;
    setIsSubmitted: (isSubmitted: boolean) => void;
}

export default function VerifyResetEmail({ email, setIsSubmitted }: VerifyResetEmailProps) {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-[#0066FF] to-[#00C896] relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1561501900-3701fa6a0864?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080"
            alt="Travel"
            className="w-full h-full object-cover opacity-30"
          />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div className=" rounded-xl w-52 inline-flex items-center justify-center mb-6">
            <img src="/slogan.png" alt="Staylio" />
          </div>

          <div className="max-w-md">
            <h1 className="text-4xl lg:text-5xl mb-6 leading-tight">
              Kiểm tra email của bạn
            </h1>
            <p className="text-lg text-white/90">
              Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn.
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

          <h2 className="text-3xl mb-3">Email đã được gửi!</h2>
          <p className="text-muted-foreground mb-2">
            Chúng tôi đã gửi link khôi phục mật khẩu đến
          </p>
          <p className="font-medium text-[#0066FF] mb-8">{email}</p>

          <div className="bg-accent/50 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-medium mb-3">Bước tiếp theo:</h3>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="shrink-0">1.</span>
                <span>Kiểm tra hộp thư đến (và cả thư mục spam)</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">2.</span>
                <span>Nhấp vào link trong email</span>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">3.</span>
                <span>Tạo mật khẩu mới</span>
              </li>
            </ol>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => navigate("/login")}
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors"
            >
              Quay lại đăng nhập
            </button>
            <button
              onClick={() => setIsSubmitted(false)}
              className="w-full py-3 border-2 border-border rounded-lg hover:bg-accent transition-colors"
            >
              Gửi lại email
            </button>
          </div>

          <p className="mt-8 text-sm text-muted-foreground">
            Không nhận được email?{" "}
            <a href="#" className="text-[#0066FF] hover:underline">
              Liên hệ hỗ trợ
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
