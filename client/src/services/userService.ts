import apiClient from "../api/apiClient";

export interface User {
  _id: string;
  name: string;
  email: string;

  role:
    | string
    | {
        _id: string;
        name: string;
      };

  facility:
    | string
    | {
        _id: string;
        name: string;
      };

  isActive: boolean;

  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: string;
  facility: string;
}

export const getUsers = async () => {
  const response =
    await apiClient.get<{
      count: number;
      users: User[];
    }>("/users");

  return response.data;
};

export const getUserById = async (
  id: string
) => {
  const response =
    await apiClient.get<{
      user: User;
    }>(`/users/${id}`);

  return response.data;
};

export const createUser = async (
  data: CreateUserRequest
) => {
  const response =
    await apiClient.post<{
      message: string;
      user: User;
    }>("/users", data);

  return response.data;
};