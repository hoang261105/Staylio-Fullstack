/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useNavigate } from "react-router";
import { Mail, ArrowLeft } from "lucide-react";
import Logo from "../components/Logo";
import VerifyResetEmail from "./VerifyResetEmail";
import ForgotPassSideBar from "../components/ForgotPassSideBar";
import { useForgotPassword } from "../../../common/hooks/useForgotPassword";
import { useApiErrors } from "../../../common/hooks/useApiErrors";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { mutateAsync } = useForgotPassword();

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
    <div className="min-h-screen flex">
      <ForgotPassSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <Logo onClick={() => navigate("/")} size="md" />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại đăng nhập</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl mb-2">Quên mật khẩu?</h2>
            <p className="text-muted-foreground">
              Nhập email của bạn để nhận link khôi phục mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-2">
                Email <span className="text-destructive">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-lg focus:outline-none focus:border-[#0066FF] transition-colors"
                  placeholder="email@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              </div>
            </div>

            <button
              type="submit"
              //   disabled={isLoading}
              className="w-full py-3 bg-[#0066FF] text-white rounded-lg hover:bg-[#0052CC] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {/* {isLoading ? "Đang gửi..." : "Gửi link khôi phục"} */} Gửi
              link khôi phục
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Nhớ mật khẩu rồi?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-[#0066FF] hover:underline cursor-pointer font-medium"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>

          <div className="mt-8 bg-accent/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Mail className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">
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
