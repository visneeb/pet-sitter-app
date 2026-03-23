export interface PaymentList {
  transactionId: number;
  paidAt: string | null;
  amount: string;
  ownerName: string;
}
