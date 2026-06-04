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
    <div className="min-h-screen flex bg-slate-50 dark:bg-gray-900 font-sans">
      <ForgotPassSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>

        <div className="w-full max-w-[440px] bg-white dark:bg-gray-800 p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 dark:border-gray-700 relative z-10">
          <div className="lg:hidden mb-8 flex justify-center">
            <img src="/slogan.png" alt="Staylio" className="h-10 w-auto" />
          </div>

          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 text-gray-500 dark:text-gray-400 dark:text-gray-500 hover:text-blue-600 mb-8 transition-colors font-medium group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span>Quay lại đăng nhập</span>
          </button>

          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-3 text-gray-900 dark:text-white">Quên mật khẩu?</h2>
            <p className="text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Nhập email của bạn để nhận link khôi phục mật khẩu
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-b dark:border-gray-700lue-500 rounded-xl transition-colors shadow-sm text-gray-900 dark:text-white"
                  placeholder="email@example.com"
                />
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all font-semibold text-lg shadow-lg shadow-blue-500/30 active:scale-[0.98]"
            >
              Gửi link khôi phục
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 dark:text-gray-500">
              Nhớ mật khẩu rồi?{" "}
              <a
                onClick={() => navigate("/login")}
                className="text-blue-600 hover:text-blue-700 hover:underline cursor-pointer font-semibold transition-colors"
              >
                Đăng nhập ngay
              </a>
            </p>
          </div>

          <div className="mt-8 bg-blue-50/50 rounded-2xl p-5 border border-b dark:border-gray-700lue-100/50">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <Mail className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                <p className="font-bold text-gray-900 dark:text-white mb-1">
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
