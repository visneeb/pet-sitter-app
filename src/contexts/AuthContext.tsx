"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "@/services/api/user";
import { authApi } from "@/services/api/auth";

type User = {
  id?: string;
  email: string;
  name?: string;
  phone?: string;
  role?: string;
  profileImgUrl?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  serverError: string;
  setServerError: (error: string) => void;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  serverError: "",
  setServerError: () => {},
  signOut: async () => {},
  refreshUser: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  const loadUser = async (): Promise<User | null> => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    // ✅ ถ้าไม่มี token ให้ clear user แล้ว return null
    if (!token) {
      setUser(null);
      localStorage.removeItem("cachedUser");
      setLoading(false);
      return null;
      return null;
    }

    try {
      // ✅ ดึง current user จริงจาก backend/profile table
      const userData = await userApi.getCurrentUser();

      setUser(userData);

      if (userData) {
        localStorage.setItem("cachedUser", JSON.stringify(userData));
      } else {
        localStorage.removeItem("cachedUser");
      }
      return userData;
    } catch {
      setUser(null);
      localStorage.removeItem("cachedUser");
      localStorage.removeItem("accessToken");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error("Logout API failed:", error);
      localStorage.removeItem("accessToken");
    } finally {
      setUser(null);
      localStorage.removeItem("cachedUser");
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  };

  const refreshUser = async () => loadUser();

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