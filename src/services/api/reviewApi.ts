import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type CreateReviewPayload = {
  booking_id: number;
  rating: number;
  comment: string;
};

export const reviewApi = {
  createReview: async (payload: CreateReviewPayload) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("accessToken")
        : null;

    if (!token) {
      throw new Error("No access token found");
    }

    const response = await axios.post(`${API_URL}/reviews`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  },
};