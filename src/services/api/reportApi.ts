import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateReportPayload = {
  booking_id: number;
  issue: string;
  description: string;
};

export const reportApi = {
  createReport: async (payload: CreateReportPayload) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.post(`${API_URL}/reports`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
};