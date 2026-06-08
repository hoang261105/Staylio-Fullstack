/* eslint-disable @typescript-eslint/no-explicit-any */
import { UserLoginForm } from "@common/interfaces/request/UserLoginForm";
import { login } from "@common/services/auth.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import { useApiErrors } from "./useApiErrors";

export const useLoginForm = (onSubmitSuccess: (path: string) => void) => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<UserLoginForm>({
    email: "",
    password: "",
  });

  const [rememberMe, setRememberMe] = useState(false);

  const { fieldErrors, handleApiErrors, clearAllErrors } = useApiErrors();

  const mutation = useLoginMutation(
    async (response: any) => {
      const userData = response?.data;

      const authorities = userData?.authorities;

      const redirectPath = getRedirectPathByRole(authorities);
      if (!redirectPath) {
        toast.error("Không xác định được vai trò người dùng.");
        return;
      }


      const role = authorities?.[0]?.authority;
      if (role) {
        localStorage.setItem("roleName", role);
      }

      await queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast.success("Đăng nhập thành công!");
      clearAllErrors();

      setTimeout(() => {
        if (onSubmitSuccess) {
          onSubmitSuccess(redirectPath);
        } else {
          window.location.href = redirectPath;
        }
      }, 500);
    },
    (error: any) => {
      const serverErrors = error?.response?.data?.errors;

      if (Array.isArray(serverErrors)) {
        handleApiErrors(serverErrors);
        return;
      }

      toast.error(
        error?.response?.data?.message || "Đã có lỗi xảy ra, vui lòng thử lại.",
      );
    },
  );

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearAllErrors();
    mutation.mutate(formData);
  };

  return {
    formData,
    setFormData,
    rememberMe,
    setRememberMe,
    fieldErrors,
    isLoading: mutation.isPending,
    handleSubmit,
  };
};

export const useLoginMutation = (
  onSuccess: (data: any) => void,
  onError: (err: unknown) => void,
) => {
  return useMutation({
    mutationFn: (data: UserLoginForm) => login(data),
    onSuccess: (response) => {
      onSuccess(response);
    },
    onError: (error: unknown) => {
      onError(error);
    },
  });
};

const getRedirectPathByRole = (authorities: { authority: string }[]) => {
  const role = authorities?.[0]?.authority.replace("ROLE_", "");

  switch (role) {
    case "ADMIN":
      return "/dashboard";
    case "CUSTOMER":
      return "/";
    case "MANAGER":
      return "/dashboard";
    default:
      return null;
  }
};
