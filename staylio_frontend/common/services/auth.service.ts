import type { ProfileRequest, ChangePasswordRequest, NewPasswordRequest } from "@common/interfaces";
import { ApiResponse } from "@common/interfaces/ApiResponse";
import { UserLoginForm } from "@common/interfaces/request/UserLoginForm";
import { UserRegisterRequest } from "@common/interfaces/request/UserRegisterRequest";
import { UserResponse } from "@common/interfaces/response/UserResponse";
import { axiosInstance } from "@common/utils/axiosInstance";

export const register = async (userRegister: UserRegisterRequest): Promise<ApiResponse<UserResponse>> => {
  try {
    const response = await axiosInstance.post("/auth/register", userRegister);
    return response.data;
  } catch (error) {
    console.error("Đăng ký thất bại:", error);
    throw error;
  }
};

export const verifyEmail = async (token: string): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.get(`/auth/verify-registration`, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Xác minh email thất bại:", error);
    throw error;    
  }
};

export const login = async (loginData: UserLoginForm) => {
  try {
    const response = await axiosInstance.post("/auth/login", loginData);
    return response.data;
  } catch (error) {
    console.error("Đăng nhập thất bại:", error);
    throw error;
  }
};

export const googleLogin = async (idToken: string) => {
  try {
    const response = await axiosInstance.post("/auth/google-login", { idToken });
    return response.data;
  } catch (error) {
    console.error("Đăng nhập Google thất bại:", error);
    throw error;
  }
};

export const forgotPassword = async (email: string): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.get("/auth/forgot-password", {
      params: { email },
    });
    return response.data;
  } catch (error) {
    console.error("Yêu cầu quên mật khẩu thất bại:", error);
    throw error;
  }
}

export const resetPassword = async (token: string, newPasswordRequest: NewPasswordRequest): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.patch("/auth/reset-password", newPasswordRequest, {
      params: { token },
    });
    return response.data;
  } catch (error) {
    console.error("Đặt lại mật khẩu thất bại:", error);
    throw error;
  }
}

export const logout = async (): Promise<ApiResponse<string>> => {
  try {
    const response = await axiosInstance.post("/auth/logout", {});
    return response.data;
  } catch (error) {
    console.error("Đăng xuất thất bại:", error);
    throw error;
  }
}

export const getProfileMe = async () => {
  try {
    const response = await axiosInstance.get("/profile/me");
    return response.data;
  } catch (error) {
    console.error("Lấy thông tin cá nhân thất bại:", error);
    throw error;
  }
}

export const updateProfile = async (data: ProfileRequest) => {
  const formData = new FormData();

  formData.append("fullName", data.fullName);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("address", data.address);
  formData.append("dateOfBirth", data.dateOfBirth);

  if (data.gender) {
    formData.append("gender", data.gender);
  }

  if (data.avatarUrl) {
    formData.append("avatarUrl", data.avatarUrl);
  }

  const response = await axiosInstance.patch(
    "/profile/update",
    formData,
    {
      withCredentials: true,
    }
  );

  return response.data;
};

export const changePassword = async (data: ChangePasswordRequest) => {
  try {
    const response = await axiosInstance.patch("/profile/change-password", data);
    return response.data;
  } catch (error) {
    console.error("Đổi mật khẩu thất bại:", error);
    throw error;
  }
};