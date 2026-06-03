import { useNavigate } from "react-router";

import { useLoginForm } from "../../../common/hooks/useLoginForm";
import LoginSideBar from "../components/LoginSideBar";
import LoginForm from "../components/LoginForm";

export default function Login() {
  const navigate = useNavigate();
  
  const { 
    formData, 
    setFormData, 
    rememberMe, 
    setRememberMe, 
    fieldErrors, 
    isLoading, 
    handleSubmit 
  } = useLoginForm(() => {
    navigate("/");
  });
  return (
    <div className="min-h-screen flex bg-slate-50 font-sans">
      <LoginSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 lg:p-24 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-blue-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none hidden lg:block"></div>

        <div className="w-full max-w-[440px] bg-white p-8 sm:p-10 rounded-3xl shadow-2xl shadow-gray-200/50 border border-gray-100 relative z-10">
          <LoginForm 
            formData={formData} 
            setFormData={setFormData}
            rememberMe={rememberMe}
            setRememberMe={setRememberMe}
            fieldErrors={fieldErrors}
            isLoading={isLoading}
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </div>
  );
}
