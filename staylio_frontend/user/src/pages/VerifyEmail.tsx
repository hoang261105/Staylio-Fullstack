import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Mail, CheckCircle, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useVerifyEmail } from "../../../common/hooks/useVerifyEmail";
import toast from "react-hot-toast";
import VerifyEmailSideBar from "../components/VerifyEmailSideBar";
import { Button } from "../../../common/components/ui/button";

export default function VerifyEmail() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get("email") || "your@email.com";
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const token = searchParams.get("token");

  const { data, isError } = useVerifyEmail(token);
  const canLogin = data?.success === true;

  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
      setCanResend(countdown - 1 <= 0);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  useEffect(() => {
    if (!data) return;

    if (data.success) {
      toast.success(data.message);
      setTimeout(() => navigate("/login"), 2000);
    } else {
      toast.error(data.message);
    }
  }, [data, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error("Xác thực thất bại!");
    }
  }, [isError]);

  const handleResendEmail = async () => {
    setIsResending(true);
    setResendSuccess(false);

    setTimeout(() => {
      setIsResending(false);
      setResendSuccess(true);
      setCountdown(60);
      setCanResend(false);

      setTimeout(() => {
        setResendSuccess(false);
      }, 3000);
    }, 1500);
  };

  const handleTabLogin = () => {
    console.log(data)
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex">
      <VerifyEmailSideBar />

      {/* Right Side - Content */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Main Content */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-primary" />
            </div>

            <h2 className="text-3xl mb-3 text-foreground">Kiểm tra email của bạn</h2>
            <p className="text-muted-foreground">
              Chúng tôi đã gửi một email xác thực đến
            </p>
            <p className="font-medium text-primary mt-1">{email}</p>
          </div>

          {/* Instructions */}
          <div className="bg-accent/50 rounded-xl p-6 mb-6 text-foreground">
            <h3 className="font-medium mb-4 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-primary" />
              Hướng dẫn xác thực
            </h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                  1
                </span>
                <span>Mở hộp thư đến của bạn</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                  2
                </span>
                <span>Tìm email từ STAYLIO (kiểm tra cả thư mục spam)</span>
              </li>
              <li className="flex gap-3">
                <span className="shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs">
                  3
                </span>
                <span>Nhấp vào nút "Xác thực tài khoản" trong email</span>
              </li>
            </ol>
          </div>

          {/* Resend Email */}
          <div className="border border-border rounded-xl p-6 mb-6">
            <div className="flex items-start gap-3 mb-4 text-foreground">
              <Clock className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium mb-1">
                  Không nhận được email?
                </p>
                <p className="text-sm text-muted-foreground">
                  Kiểm tra thư mục spam hoặc yêu cầu gửi lại email xác thực
                </p>
              </div>
            </div>

            {resendSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-4 flex items-center gap-2 text-sm text-emerald-500">
                <CheckCircle className="w-4 h-4" />
                <span>Email đã được gửi lại thành công!</span>
              </div>
            )}

            <Button
              variant="outline"
              onClick={handleResendEmail}
              disabled={!canResend || isResending}
              className="w-full flex items-center justify-center gap-2 py-6 border-2 border-primary text-primary hover:bg-primary/5 font-medium rounded-lg"
            >
              <RefreshCw
                className={`w-5 h-5 ${isResending ? "animate-spin" : ""}`}
              />
              {isResending
                ? "Đang gửi..."
                : canResend
                  ? "Gửi lại email"
                  : `Gửi lại sau ${countdown}s`}
            </Button>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleTabLogin}
              disabled={!canLogin}
              className="w-full py-6 font-medium rounded-lg"
            >
              Đã xác thực, đăng nhập ngay
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/")}
              className="w-full py-6 rounded-lg"
            >
              Về trang chủ
            </Button>
          </div>

          {/* Help Text */}
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Vẫn gặp vấn đề?
            </p>
            <a
              href="#"
              className="text-sm text-primary hover:underline font-medium"
            >
              Liên hệ bộ phận hỗ trợ
            </a>
          </div>

          {/* Security Note */}
          <div className="mt-8 bg-accent/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center shrink-0">
                <AlertCircle className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
                  Lưu ý bảo mật
                </p>
                <p>
                  Link xác thực sẽ hết hạn sau 24 giờ. Nếu bạn không yêu cầu
                  đăng ký tài khoản, vui lòng bỏ qua email này.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
