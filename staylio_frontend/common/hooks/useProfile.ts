/* eslint-disable @typescript-eslint/no-explicit-any */
import { ProfileRequest } from "@common/interfaces";
import { getProfileMe, updateProfile } from "@common/services/auth.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useProfile = () => {
  return useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const response = await getProfileMe();
      return response.data;
    },
    retry: false,
    enabled: !!localStorage.getItem("user") || !!localStorage.getItem("roleName"),
  });
}

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