/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation } from "@tanstack/react-query";
import { logout, register } from "../services/auth.service";
import { UserRegisterRequest } from "@common/interfaces/request/UserRegisterRequest";

export const useRegisterMutation = (onSuccess: () => void, onError: (err: any) => void) => {
  return useMutation({
    mutationFn: (data: UserRegisterRequest) => register(data),
    onSuccess: () => {
      onSuccess();
    },
    onError: (error: any) => {
      onError(error);
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const response = await logout();
      return response;
    }
  });
}