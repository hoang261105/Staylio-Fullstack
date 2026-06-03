import { useNavigate } from "react-router-dom";
import { InputField } from "../../../common/components/InputField";
import { ArrowRight } from "lucide-react";
import { useLoginForm } from "../../../common/hooks/useLoginForm";

export default function ManagerLogin() {
  const navigate = useNavigate();

  const { 
    formData, 
    setFormData, 
    isLoading, 
    fieldErrors,
    handleSubmit 
  } = useLoginForm((redirectPath) => {
    navigate(redirectPath);
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-400/20 blur-[100px] mix-blend-multiply" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-[#0066FF]/10 blur-[100px] mix-blend-multiply" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="flex justify-center items-center gap-3">
          <div className="w-32 inline-flex items-center">
            <img
              src="/slogan.png"
              alt="Staylio"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl font-bold text-gray-900">
          Cổng Quản Lý Chi Nhánh
        </h2>
        <p className="mt-2 text-center text-sm text-gray-500">
          Vui lòng đăng nhập để tiếp tục
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-black/5 sm:rounded-2xl sm:px-10 border border-white/50">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <InputField
                label="Email quản lý"
                type="email"
                required
                value={formData.email}
                error={fieldErrors.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="manager@staylio.com"
              />
            </div>

            <div>
              <InputField
                label="Mật khẩu"
                type="password"
                required
                value={formData.password}
                error={fieldErrors.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#0066FF] focus:ring-[#0066FF] border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Ghi nhớ đăng nhập
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-[#0066FF] hover:text-[#0052CC] transition-colors"
                >
                  Quên mật khẩu?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-semibold text-white bg-[#0066FF] hover:bg-[#0052CC] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0066FF] transition-all transform active:scale-[0.98]"
              >
                {isLoading ? "Đang đăng nhập..." : "Đăng nhập hệ thống"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
