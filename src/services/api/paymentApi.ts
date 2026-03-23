import axios from "axios";
import { PaymentList } from "@/types/paymentType";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const getAuthHeaders = () => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  if (!token) throw new Error("No access token found");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
};

export interface PayoutSummary {
  totalEarning: number;
  transactions: PaymentList[];
}

export const paymentApi = {
  createCardIntent: async (bookingId: number, amount: number) => {
    const response = await axios.post(
      `${API_URL}/api/payment/create-intent`,
      { bookingId, amount },
      { headers: getAuthHeaders() },
    );
    return response.data as { clientSecret: string };
  },

  createCashTransaction: async (bookingId: number) => {
    const response = await axios.post(
      `${API_URL}/api/payment/create-cash`,
      { bookingId },
      { headers: getAuthHeaders() },
    );
    return response.data;
  },

  getPayoutSummary: async (petSitterId: number) => {
    const response = await axios.get(
      `${API_URL}/api/payment/payout-summary/${petSitterId}`,
      { headers: getAuthHeaders() },
    );
    return response.data as PayoutSummary;
  },
};
