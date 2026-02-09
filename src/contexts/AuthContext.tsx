import React, { useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";
import api from "../api/axios";
import type { User } from "../types/auth";
import { AuthContext } from "../hooks/useAuth";
import type { LoginResponse } from "@/utils/validators";

const getInitialAuth = () => {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");
  if (token && userStr) {
    try {
      return { token, user: JSON.parse(userStr) };
    } catch {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
  }
  return { token: null, user: null };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const initialData = getInitialAuth();
  const [user, setUser] = useState<User | null>(initialData.user);
  const [token, setToken] = useState<string | null>(initialData.token);
  const [isLoading, setIsLoading] = useState(false);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  }, []);

  useEffect(() => {
    const verify = async () => {
      if (token) {
        setIsLoading(true);
        try {
          await api.post("/auth/verify");
        } catch {
          logout();
        } finally {
          setIsLoading(false);
        }
      }
    };
    verify();
  }, [token, logout]);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post<LoginResponse>("/auth/login", {
        email,
        password,
      });
      const { token: newToken, user: userData } = response.data;

      localStorage.setItem("token", newToken);
      localStorage.setItem("user", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
    } catch (error: unknown) {
      console.error("Login failed", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
