import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const createApiInstance = (withAuth: boolean) => {
  const instance = axios.create({
    baseURL,
  });

  // Private - attach JWT token from localStorage
  if (withAuth && process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
    instance.interceptors.request.use(async (config) => {
      try {
        const token =
          typeof window !== "undefined"
            ? localStorage.getItem("accessToken")
            : null;

        if (token) {
          config.headers = config.headers ?? {};
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("No JWT token found for authenticated request");
        }
      } catch (error) {
        console.error("Error getting JWT token:", error);
      }

      return config;
    });
  }

  // Response error handler
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        error.message = "Network error. Please try again.";
        return Promise.reject(error);
      }

      const { status, data } = error.response;

      // Only authenticated clients should own session-expiry redirects.
      if (status === 401 && withAuth) {
        console.warn("Unauthorized - redirecting to login");
        if (typeof window !== "undefined") {
          localStorage.removeItem("accessToken");
          window.location.href = "/auth/login";
        }
        return Promise.reject(
          new Error("Session expired. Please login again."),
        );
      }

      // Better error message extraction
      let errorMessage = `Request failed with status ${status}`;

      if (data) {
        if (typeof data === "string") {
          errorMessage = data;
        } else if (data.message) {
          errorMessage = data.message;
        } else if (data.error) {
          errorMessage = data.error;
        } else if (data.detail) {
          errorMessage = data.detail;
        }
      }

      error.message = errorMessage;
      return Promise.reject(error);
    },
  );

  return instance;
};

export const publicApi = createApiInstance(false);
export const privateApi = createApiInstance(true);
