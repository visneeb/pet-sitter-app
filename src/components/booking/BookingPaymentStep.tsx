

"use client";

import React from "react";
import { WalletIcon, CreditCardIcon } from "@/assets/icons/components";
import { Paw } from "@/decorations/Paw";
import { ActionButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/input/Input";
import {
  validatePaymentForm,
  hasPaymentErrors,
  type PaymentMethod,
} from "@/lib/validations/paymentValidation";

type Props = {
  paymentMethod: PaymentMethod;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  loading?: boolean;
  isConfirmOpen?: boolean;

  onChangePaymentMethod: (value: PaymentMethod) => void;
  onChangeCardName: (value: string) => void;
  onChangeCardNumber: (value: string) => void;
  onChangeExpiryDate: (value: string) => void;
  onChangeCvv: (value: string) => void;

  onBack: () => void;
  onOpenConfirmModal: () => void;
};

export function BookingPaymentStep({
  paymentMethod,
  cardName,
  cardNumber,
  expiryDate,
  cvv,
  loading = false,
  isConfirmOpen = false,
  onChangePaymentMethod,
  onChangeCardName,
  onChangeCardNumber,
  onChangeExpiryDate,
  onChangeCvv,
  onBack,
  onOpenConfirmModal,
}: Props) {
  const [errors, setErrors] = React.useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleClickSubmit = () => {
    const nextErrors = validatePaymentForm({
      paymentMethod,
      cardName,
      cardNumber,
      expiryDate,
      cvv,
    });

    setErrors(nextErrors);

    if (hasPaymentErrors(nextErrors)) return;

    onOpenConfirmModal();
  };

  const canSubmit =
    paymentMethod === "cash"
      ? true
      : Boolean(
          cardName.trim() &&
            cardNumber.trim() &&
            expiryDate.trim() &&
            cvv.trim(),
        );

  return (
    <div
      className={`transition-opacity duration-200 ${
        isConfirmOpen ? "opacity-40" : "opacity-100"
      }`}
    >
      <h1 className="text-lg font-semibold text-gray-900">Payment</h1>

      <div className="mt-6 flex-1">
        <div className="mb-6 grid max-w-md grid-cols-2 gap-4">
          <ActionButton
            variant="secondary"
            className={`border bg-white transition-colors ${
              paymentMethod === "credit_card"
                ? "border-orange-500 text-orange-500"
                : "border-gray-300 text-gray-400"
            }`}
            onClick={() => onChangePaymentMethod("credit_card")}
          >
            <CreditCardIcon />
            Credit Card
          </ActionButton>

          <ActionButton
            variant="secondary"
            className={`border bg-white transition-colors ${
              paymentMethod === "cash"
                ? "border-orange-500 text-orange-500"
                : "border-gray-300 text-gray-400"
            }`}
            onClick={() => onChangePaymentMethod("cash")}
          >
            <WalletIcon />
            Cash
          </ActionButton>
        </div>

        {paymentMethod === "credit_card" ? (
          <div className="grid max-w-md gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Name on Card
              </label>
              <Input
                placeholder="Enter cardholder name"
                value={cardName}
                error={errors.cardName}
                onChange={(e) => onChangeCardName(e.target.value)}
              />
              {errors.cardName && (
                <p className="text-sm text-red-500">{errors.cardName}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">
                Card Number
              </label>
              <Input
                placeholder="1234 5678 9012 3456"
                value={cardNumber}
                error={errors.cardNumber}
                onChange={(e) => onChangeCardNumber(e.target.value)}
              />
              {errors.cardNumber && (
                <p className="text-sm text-red-500">{errors.cardNumber}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">
                  Expiry Date
                </label>
                <Input
                  placeholder="MM/YY"
                  value={expiryDate}
                  error={errors.expiryDate}
                  onChange={(e) => onChangeExpiryDate(e.target.value)}
                />
                {errors.expiryDate && (
                  <p className="text-sm text-red-500">{errors.expiryDate}</p>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">CVV</label>
                <Input
                  placeholder="123"
                  value={cvv}
                  error={errors.cvv}
                  onChange={(e) => onChangeCvv(e.target.value)}
                />
                {errors.cvv && (
                  <p className="text-sm text-red-500">{errors.cvv}</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-[220px] max-w-md items-center justify-center rounded-2xl bg-[#f7f7fb] px-6 text-center">
            <div className="flex flex-col items-center gap-4 text-center">
              <Paw className="h-30 w-30 animate-spin text-pink-500" />
              <p className="text-sm leading-7 text-gray-600">
                If you want to pay by cash,
                <br />
                you are required to make a cash payment
                <br />
                upon arrival at the pet sitter&apos;s location.
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="w-[120px]">
          <ActionButton variant="secondary" onClick={onBack}>
            Back
          </ActionButton>
        </div>

        <div className="flex-1" />

        <div className="flex justify-end">
          <ActionButton
            variant="primary"
            disabled={!canSubmit || loading}
            onClick={handleClickSubmit}
          >
            {loading ? "Processing..." : "Confirm Booking"}
          </ActionButton>
        </div>
      </div>
    </div>
  );
}