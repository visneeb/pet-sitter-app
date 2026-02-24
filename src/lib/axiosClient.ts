import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const createApiInstance = (withAuth: boolean) => {
  const instance = axios.create({
    baseURL,
    withCredentials: withAuth,
  });

  // private
  if (withAuth && process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
    instance.interceptors.request.use((config) => {
      const token = localStorage.getItem("access_token");

      if (token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    });
  }

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        error.message = "Network error. Please try again.";
        return Promise.reject(error);
      }

      const { status, data } = error.response;

      error.message = data?.error || `Request failed with status ${status}`;

      return Promise.reject(error);
    },
  );

  return instance;
};
