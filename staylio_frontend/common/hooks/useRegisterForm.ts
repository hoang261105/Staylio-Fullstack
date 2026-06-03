import { Gender } from "@common/enums/Gender";
import { useState } from "react";
import { useRegisterMutation } from "./useAuthMutation";
import toast from "react-hot-toast";
import { useApiErrors } from "./useApiErrors";
import { UserRegisterRequest } from "@common/interfaces/request/UserRegisterRequest";

export const useRegisterForm = (onSubmitSuccess: () => void) => {
  const [formData, setFormData] = useState<UserRegisterRequest>({
    userName: "",
    fullName: "",
    gender: Gender.MALE,
    email: "",
    password: "",
    dateOfBirth: new Date().toISOString().split("T")[0],
  });

  const {
    fieldErrors,
    formError,
    handleApiErrors,
    clearFieldError,
    clearAllErrors,
  } = useApiErrors();

  const mutation = useRegisterMutation(
    () => {
      toast.success(
        "Đăng ký thành công! Vui lòng xác thực trước khi đăng nhập.",
      );
      onSubmitSuccess();
    },
    (error) => {
      const serverResponse = error?.response?.data.errors;

      if (serverResponse) {
        handleApiErrors(serverResponse);
      } else {
        toast.error("Đăng ký thất bại. Vui lòng thử lại.");
      }
    },
  );

  const getPasswordStrength = () => {
    const password = formData.password;
    if (password.length === 0) return { strength: 0, label: "", color: "" };
    if (password.length < 6)
      return { strength: 1, label: "Yếu", color: "bg-red-500" };
    if (password.length < 10)
      return { strength: 2, label: "Trung bình", color: "bg-yellow-500" };
    return { strength: 3, label: "Mạnh", color: "bg-green-500" };
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    mutation.mutate(formData);
  };

  return {
    formData,
    setFormData,
    fieldErrors,
    formError,
    isLoading: mutation.isPending,
    clearFieldError,
    handleSubmit,
    getPasswordStrength,
  };
};
