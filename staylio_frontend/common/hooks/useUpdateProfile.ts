/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfileRequest } from "@common/interfaces";
import { updateProfile } from "@common/services/auth.service";
import { useMutation } from "@tanstack/react-query";

export const useUpdateProfile = (onSuccess?: () => void) => {
  return useMutation<
    any,
    {
      response?: {
        data?: {
          errors?: { field: string; message: string }[];
        };
      };
    },
    ProfileRequest
  >({
    mutationFn: (data) => updateProfile(data),

    onSuccess: (res) => {
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
        window.dispatchEvent(new Event("userChanged"));
      }

      onSuccess?.();
    },
  });
};