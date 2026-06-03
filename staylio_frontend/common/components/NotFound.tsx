import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, MapPinOff } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const getHomePathByRole = () => {
    const userStr = localStorage.getItem("user");
    if (!userStr) return "/login";

    try {
      const user = JSON.parse(userStr);

      const role = user?.authorities?.[0]?.authority;

      if (role === "ROLE_ADMIN") return "/admin/dashboard";
      if (role === "ROLE_CUSTOMER") return "/";
      if (role === "ROLE_MANAGER") return "/dashboard";

      return "/";
    } catch {
      return "/login";
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-slate-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative flex justify-center items-center">
          <h1 className="text-[150px] font-black text-slate-200 leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white p-4 rounded-full shadow-lg shadow-blue-500/20 animate-bounce">
              <MapPinOff className="w-12 h-12 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight sm:text-4xl">
            Lạc đường rồi!
          </h2>
          <p className="text-lg text-slate-600">
            Trang bạn đang tìm kiếm không tồn tại, đã bị xóa hoặc tạm thời không
            thể truy cập.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-6 py-3 border-2 border-slate-300 text-base font-medium rounded-xl text-slate-700 bg-white hover:bg-slate-100 hover:border-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-all duration-200 group shadow-sm"
          >
            <ArrowLeft className="mr-2 w-5 h-5 text-slate-500 group-hover:-translate-x-1 transition-transform" />
            Quay lại
          </button>

          <button
            onClick={() => navigate(getHomePathByRole())}
            className="inline-flex items-center justify-center px-6 py-3 border border-gray-600 rounded-xl text-base font-medium "
          >
            <Home className="mr-2 w-5 h-5 group-hover:scale-110 transition-transform" /> 
            Trang chủ
          </button>
        </div>
      </div>
    </div>
  );
}
