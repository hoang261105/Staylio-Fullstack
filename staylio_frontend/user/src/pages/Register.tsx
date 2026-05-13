import { useNavigate } from "react-router";
import RegisterSideBar from "../components/RegisterSideBar";
import { RegisterForm } from "../components/RegisterForm";
import { useRegisterForm } from "../../../common/hooks/useRegisterForm";

export default function Register() {
  const navigate = useNavigate();
  const { formData, setFormData, fieldErrors, isLoading, handleSubmit, getPasswordStrength } = 
    useRegisterForm(() => navigate(`/verify-email?email=${encodeURIComponent(formData.email)}`));

  return (
    <div className="min-h-screen flex">
      <RegisterSideBar />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          <RegisterForm 
              formData={formData} 
              setFormData={setFormData}
              errors={fieldErrors}
              isLoading={isLoading}
              onSubmit={handleSubmit}
              passwordStrength={getPasswordStrength()}
           />
        </div>
      </div>
    </div>
  );
}
