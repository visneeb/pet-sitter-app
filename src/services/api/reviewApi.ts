
import { privateApi } from "./client";

export type CreateReviewPayload = {
  booking_id: number;
  rating: number;
  comment: string;
};

export type CreateReviewResponse = {
  message: string;
  data: {
    review_id: number;
    booking_id: number;
    rating: number;
    comment: string;
    created_at: string;
  };
};

export const reviewApi = {
  createReview: async (
    payload: CreateReviewPayload
  ): Promise<CreateReviewResponse> => {
    const response = await privateApi.post("/reviews", payload);
    return response.data;
  },
};