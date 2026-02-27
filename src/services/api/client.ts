import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const baseURL = process.env.NEXT_PUBLIC_API_URL;

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_URL is not defined");
}

export const createApiInstance = (withAuth: boolean) => {
  const instance = axios.create({ baseURL });

  //  Private — attach Supabase session token
  if (withAuth && process.env.NEXT_PUBLIC_DISABLE_AUTH !== "true") {
    instance.interceptors.request.use(async (config) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.access_token) {
        config.headers = config.headers ?? {};
        config.headers.Authorization = `Bearer ${session.access_token}`;
      }

      return config;
    });
  }

  //  Response error handler
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

//  Ready-to-use instances
export const publicApi = createApiInstance(false);
export const privateApi = createApiInstance(true);
