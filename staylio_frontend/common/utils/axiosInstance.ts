/* eslint-disable @typescript-eslint/no-explicit-any */
import { RoleName } from "@common/enums/RoleName";
import axios from "axios";
import toast from "react-hot-toast";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      return Promise.reject(error);
    }

    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then(() => axiosInstance(originalRequest))
        .catch((err) => Promise.reject(err));
    }

    isRefreshing = true;

    try {
      const res = await axiosInstance.post(
        "/auth/refresh-token",
        {},
        { withCredentials: true }
      );

      if (!res || res.status !== 200) {
        throw new Error("Refresh token failed");
      }

      processQueue(null);

      return axiosInstance(originalRequest);

    } catch (err: any) {
      processQueue(err, null);

      if (localStorage.getItem("user") || localStorage.getItem("roleName")) {
        redirectByRole();
      }

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);
let isRedirecting = false;

const redirectByRole = () => {
  if (isRedirecting) return;
  isRedirecting = true;

  toast.error("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại.");

  setTimeout(() => {
    const role = localStorage.getItem("roleName");
    
    localStorage.removeItem("roleName");
    localStorage.removeItem("user");

    if (role === RoleName.ROLE_ADMIN) {
      window.location.href = "/admin/login";
    } else if (role === RoleName.ROLE_MANAGER) {
      window.location.href = "/login";
    } else {
      window.location.href = "/";
    }
  }, 2000);
};
