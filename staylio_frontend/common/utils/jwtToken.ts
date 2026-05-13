import { jwtDecode } from "jwt-decode";

type JwtPayload = {
  id: number;
  role: string;
  exp: number;
};

const getAccessToken = (): string | null => {
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("accessToken="))
    ?.split("=")[1] || null;
};

export const decodeToken = (): JwtPayload | null => {
  const token = getAccessToken();
  if (!token) return null;

  try {
    return jwtDecode<JwtPayload>(token);
  } catch {
    return null;
  }
};

export const getUserId = (): number | null => {
  const decoded = decodeToken();
  return decoded?.id ?? null;
};

export const getRole = (): string | null => {
  const decoded = decodeToken();
  return decoded?.role ?? null;
};

export const isTokenExpired = (): boolean => {
  const decoded = decodeToken();
  if (!decoded?.exp) return true;

  return decoded.exp * 1000 < Date.now();
};