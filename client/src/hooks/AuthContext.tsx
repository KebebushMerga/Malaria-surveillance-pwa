import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import apiClient from "../api/apiClient";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  facility?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext =
  createContext<AuthContextType | undefined>(
    undefined
  );

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] =
    useState<AuthUser | null>(() => {
      const storedUser =
        localStorage.getItem("user");

      return storedUser
        ? JSON.parse(storedUser)
        : null;
    });

  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem("token")
    );

  useEffect(() => {
    if (token) {
      apiClient.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${token}`;
    } else {
      delete apiClient.defaults.headers.common[
        "Authorization"
      ];
    }
  }, [token]);

  const login = async (
    email: string,
    password: string
  ) => {
    const response = await apiClient.post(
      "/auth/login",
      {
        email,
        password,
      }
    );

    const {
      token: receivedToken,
      user: receivedUser,
    } = response.data;

    localStorage.setItem(
      "token",
      receivedToken
    );

    localStorage.setItem(
      "user",
      JSON.stringify(receivedUser)
    );

    setToken(receivedToken);
    setUser(receivedUser);

    apiClient.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${receivedToken}`;
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setToken(null);
    setUser(null);

    delete apiClient.defaults.headers.common[
      "Authorization"
    ];
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside AuthProvider"
    );
  }

  return context;
};