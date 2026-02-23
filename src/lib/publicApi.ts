import { createApiInstance } from "./axiosClient";

export const publicApi = createApiInstance(false);

// วิธีใช้ >> await publicApi.post("/login", data);