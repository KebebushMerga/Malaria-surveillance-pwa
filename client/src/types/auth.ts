export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  facility: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: AuthUser;
}