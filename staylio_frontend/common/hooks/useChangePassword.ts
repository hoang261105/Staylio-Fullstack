import { useMutation } from "@tanstack/react-query";

import { changePassword, resetPassword } from "@common/services/auth.service";

import type { ChangePasswordRequest, NewPasswordRequest } from "@common/interfaces";

export const useChangePasswordMutation = (
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: (data: ChangePasswordRequest) =>
      changePassword(data),

    onSuccess: () => {
      onSuccess?.();
    },

    onError: (error) => {
      onError?.(error);
    },
  });
};

export const useResetPasswordMutation = (
  onSuccess?: () => void,
  onError?: (error: unknown) => void
) => {
  return useMutation({
    mutationFn: ({ token, newPasswordRequest }: { token: string; newPasswordRequest: NewPasswordRequest }) => resetPassword(token, newPasswordRequest),
    onSuccess: () => {
      onSuccess?.();
    },
    onError: (error) => {
      onError?.(error);
    }
  })
    
}