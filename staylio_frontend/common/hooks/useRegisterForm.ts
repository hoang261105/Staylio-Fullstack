/* eslint-disable @typescript-eslint/no-explicit-any */
import { Gender } from "@common/enums/Gender";
import { useState } from "react";
import { useRegisterMutation } from "./useAuthMutation";
import toast from "react-hot-toast";
import { useApiErrors } from "./useApiErrors";
import { UserRegisterRequest } from "@common/interfaces/request/UserRegisterRequest";
import { useGoogleLoginMutation } from "./useLoginForm";
import { useQueryClient } from "@tanstack/react-query";

export const useRegisterForm = (onSubmitSuccess: () => void) => {
  const queryClient = useQueryClient();
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

  const getRedirectPathByRole = (authorities: { authority: string }[]) => {
    const role = authorities?.[0]?.authority?.replace("ROLE_", "");
    switch (role) {
      case "ADMIN": return "/dashboard";
      case "MANAGER": return "/dashboard";
      default: return "/";
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    const userData = response?.data;
    const userObj = userData?.user;
    const roleName = userObj?.roleName || userData?.authorities?.[0]?.authority;
    const authorities = userData?.authorities || [{ authority: roleName }];

    const redirectPath = getRedirectPathByRole(authorities);
    if (!redirectPath) {
      toast.error("Không xác định được vai trò người dùng.");
      return;
    }

    if (roleName) {
      localStorage.setItem("roleName", roleName.replace("ROLE_", ""));
    }

    await queryClient.invalidateQueries({ queryKey: ["profile"] });
    toast.success("Đăng nhập Google thành công!");
    clearAllErrors();

    setTimeout(() => {
      window.location.href = redirectPath;
    }, 500);
  };

  const handleGoogleError = () => {
    toast.error("Đăng nhập Google thất bại.");
  };

  const googleMutation = useGoogleLoginMutation(handleGoogleSuccess, handleGoogleError);

  const handleGoogleLogin = (credential: string) => {
    clearAllErrors();
    googleMutation.mutate(credential);
  };

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
    isLoading: mutation.isPending || googleMutation.isPending,
    clearFieldError,
    handleSubmit,
    getPasswordStrength,
    handleGoogleLogin,
  };
};
