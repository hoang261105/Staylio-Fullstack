/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowLeft, Loader2 } from "lucide-react";
import VerifyResetEmail from "./VerifyResetEmail";
import ForgotPassSideBar from "../components/ForgotPassSideBar";
import { useForgotPassword } from "../../../common/hooks/useForgotPassword";
import { useApiErrors } from "../../../common/hooks/useApiErrors";
import { Button } from "../../../common/components/ui/button";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutateAsync, isPending, isLoading } = useForgotPassword() as any;
  const loading = isPending || isLoading;
  const { handleApiErrors } = useApiErrors();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      await mutateAsync(email);
      setIsSubmitted(true);
      navigate(`/forgot-password?email=${encodeURIComponent(email)}`);
    } catch (error: any) {
      const response = error?.response?.data?.errors;

      if (response) {
        handleApiErrors(response);
      }
    }
  };

  if (isSubmitted) {
    return <VerifyResetEmail email={email} setIsSubmitted={setIsSubmitted} />;
  }

  return (
    <div className="min-h-screen flex bg-background font-sans">
      <ForgotPassSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>

        <div className="w-full max-w-[440px] bg-card p-8 sm:p-10 rounded-3xl shadow-2xl border border-border relative z-10">
          <div className="lg:hidden mb-8 flex justify-center">
            <img src="/slogan.png" alt="Staylio" className="h-10 w-auto" />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại đăng nhập</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-card-foreground">Quên mật khẩu?</h2>
            <p className="text-muted-foreground">
              Nhập email của bạn để nhận link khôi phục mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-card-foreground mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary rounded-xl transition-colors shadow-sm text-foreground"
                  placeholder="email@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-lg font-semibold rounded-xl"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Đang gửi...
                </>
              ) : (
                "Gửi link khôi phục"
              )}
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nhớ mật khẩu rồi?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-primary hover:text-primary/80 hover:underline cursor-pointer font-semibold transition-colors"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>

          <div className="mt-8 bg-primary/5 rounded-2xl p-5 border border-primary/10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-primary" />
              </div>
              <div className="text-sm text-muted-foreground leading-relaxed">
                <p className="font-bold text-foreground mb-1">
                  Lưu ý quan trọng
                </p>
                <p>
                  Nếu không tìm thấy email, vui lòng kiểm tra thư mục spam hoặc
                  thư rác. Link khôi phục sẽ hết hạn sau 1 giờ.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
