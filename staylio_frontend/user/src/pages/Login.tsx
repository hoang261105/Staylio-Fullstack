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
    <div className="min-h-screen flex">
      <LoginSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
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
