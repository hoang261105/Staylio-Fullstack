/* eslint-disable @typescript-eslint/no-explicit-any */
import { forgotPassword } from "@common/services/auth.service"
import { useMutation } from "@tanstack/react-query"

export const useForgotPassword = (
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),

    onSuccess: () => {
      onSuccess?.();
    },

    onError: (error) => {
      onError?.(error);
    },
  });
};