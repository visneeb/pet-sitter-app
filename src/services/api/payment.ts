import { privateApi } from "./client";
import { PaymentList } from "@/types/paymentType";

export interface PayoutSummary {
  totalEarning: number;
  transactions: PaymentList[];
}

export const paymentApi = {
  createCardIntent: async (bookingId: number, amount: number) => {
    const response = await privateApi.post("/payment/create-intent", {
      bookingId,
      amount,
    });
    return response.data as { clientSecret: string };
  },

  createCashTransaction: async (bookingId: number) => {
    const response = await privateApi.post("/payment/create-cash", {
      bookingId,
    });
    return response.data;
  },

  getPayoutSummary: async (petSitterId: number) => {
    const response = await privateApi.get(
      `/payment/payout-summary/${petSitterId}`,
    );
    return response.data as PayoutSummary;
  },
};
