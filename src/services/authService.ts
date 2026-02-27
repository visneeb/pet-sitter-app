import { userApi } from "@/services/api/userApi";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_URL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

type ApiResponse<T> = {
  message: string;
  accessToken?: string;
  data?: T;
};

type ApiError = {
  error?: string;
  field?: string;
  message?: string;
};

const handleApiError = async (response: Response): Promise<never> => {
  const contentType = response.headers.get("content-type");
  if (!contentType?.includes("application/json")) {
    throw new Error("Server error: Invalid response format");
  }

  const errorData: ApiError = await response.json().catch(() => ({}));

  if (response.status === 400) {
    throw new Error(errorData.error || "Invalid request data");
  } else if (response.status === 401) {
    throw new Error(errorData.error || "Invalid credentials");
  } else if (response.status === 500) {
    throw new Error(errorData.error || "Server error occurred");
  } else {
    throw new Error(errorData.error || `Request failed (${response.status})`);
  }
};

const apiRequest = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    await handleApiError(response);
  }

  return response.json() as Promise<T>;
};

export const authService = {
  login: async (email: string, password: string) => {
    const data = await apiRequest<{ message: string; accessToken: string }>(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
    );

    // Store JWT token
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", data.accessToken);
    }

    return {
      user: { email },
      session: { access_token: data.accessToken },
    };
  },

  register: async (
    email: string,
    phone: string,
    password: string,
    role: "owner" | "sitter" | "admin",
  ) => {
    await apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, phone, password, role }),
    });
  },

  getUser: async () => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      return null;
    }

    try {
      return await userApi.getCurrentUser();
    } catch (error) {
      // Clear invalid token
      if (typeof window !== "undefined") {
        localStorage.removeItem("accessToken");
      }
      return null;
    }
  },

  updateEmail: async (newEmail: string, password: string) => {
    const currentUser = await userApi.getCurrentUser();

    if (!currentUser) {
      throw new Error("No active session found");
    }

    await userApi.updateProfile({
      name: currentUser.name,
      phone: currentUser.phone,
      email: newEmail,
      password,
    });
  },
};
