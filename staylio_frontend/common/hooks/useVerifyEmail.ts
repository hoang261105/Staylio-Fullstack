import { verifyEmail } from "@common/services/auth.service";
import { useQuery } from "@tanstack/react-query";

export const useVerifyEmail = (token: string | null) => {
  return useQuery({
    queryKey: ["verify-email", token],
    queryFn: () => verifyEmail(token!),
    enabled: !!token,
    retry: false,
  });
};