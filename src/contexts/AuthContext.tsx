"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { userApi } from "@/services/api/userApi";
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

  // ✅ เปลี่ยนจาก Promise<void> เป็น Promise<User | null>
  refreshUser: () => Promise<User | null>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  serverError: "",
  setServerError: () => {},
  signOut: async () => {},

  // ✅ default ต้อง return null ด้วย
  refreshUser: async () => null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ เปลี่ยนให้ loadUser return userData/null
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

      // ✅ สำคัญมาก: return userData กลับไปให้ caller ใช้ต่อ
      return userData;
    } catch {
      setUser(null);
      localStorage.removeItem("cachedUser");
      localStorage.removeItem("accessToken");

      // ✅ ถ้าโหลด user ไม่ได้ ให้ return null
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

  // ✅ เปลี่ยนให้ refreshUser return ค่าจาก loadUser
  const refreshUser = async (): Promise<User | null> => {
    return await loadUser();
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