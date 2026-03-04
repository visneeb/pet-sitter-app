"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "@/services/api/userApi";

type User = {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  serverError: string;
  setServerError: (error: string) => void;
  signOut: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  serverError: "",
  setServerError: () => {},
  signOut: () => {},
  refreshUser: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    // แก้อาการ blink ของ navbar (ใช้ cachedUser จาก localStorage ไม่ต้องรอ API)
    if (typeof window !== "undefined") {
      const cached = localStorage.getItem("cachedUser");
      return cached ? JSON.parse(cached) : null;
    }
    return null;
  });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      setUser(null);
      localStorage.removeItem("cachedUser");
      setLoading(false);
      return;
    }

    try {
      const userData = await userApi.getCurrentUser();
      setUser(userData);
      if (userData) {
        localStorage.setItem("cachedUser", JSON.stringify(userData));
      } else {
        localStorage.removeItem("cachedUser");
      }
    } catch {
      setUser(null);
      localStorage.removeItem("cachedUser");
      localStorage.removeItem("accessToken");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signOut = () => {
    localStorage.removeItem("cachedUser");
    localStorage.removeItem("accessToken");
    window.location.href = "/";
  };

  const refreshUser = async () => {
    await loadUser();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signOut,
        serverError,
        setServerError,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
