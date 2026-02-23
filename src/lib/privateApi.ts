import { createApiInstance } from "./axiosClient";

export const privateApi = createApiInstance(true);

// วิธีใช้ >> await privateApi.get("/profile");
