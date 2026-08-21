import apiClient from "../api/apiClient";
import type {
  LoginRequest,
  LoginResponse,
} from "../types/auth";

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const logoutUser = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};