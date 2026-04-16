import { privateApi } from "./client";

type CreateReviewPayload = {
  booking_id: number;
  rating: number;
  comment: string;
};

export const reviewApi = {
  createReview: (payload: CreateReviewPayload) =>
    privateApi.post("/reviews", payload).then((res) => res.data),
};
