// export type PaymentFormValues = {
//     cardName: string;
//     cardNumber: string;
//     expiryDate: string;
//     cvv: string;
//   };
  
//   export type PaymentFormErrors = {
//     cardName: string;
//     cardNumber: string;
//     expiryDate: string;
//     cvv: string;
//   };
  
//   export function validatePaymentForm(
//     values: PaymentFormValues,
//   ): PaymentFormErrors {
//     const errors: PaymentFormErrors = {
//       cardName: "",
//       cardNumber: "",
//       expiryDate: "",
//       cvv: "",
//     };
  
//     if (!values.cardName.trim()) {
//       errors.cardName = "Please enter cardholder name";
//     }
  
//     const cleanedCardNumber = values.cardNumber.replace(/\s/g, "");
//     if (!/^\d{16}$/.test(cleanedCardNumber)) {
//       errors.cardNumber = "Card number must be 16 digits";
//     }
  
//     if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiryDate)) {
//       errors.expiryDate = "Expiry date must be in MM/YY format";
//     }
  
//     if (!/^\d{3,4}$/.test(values.cvv)) {
//       errors.cvv = "CVV must be 3 or 4 digits";
//     }
  
//     return errors;
//   }
  
//   export function hasPaymentErrors(errors: PaymentFormErrors) {
//     return Object.values(errors).some(Boolean);
//   }

export type PaymentMethod = "credit_card" | "cash";

export type PaymentFormValues = {
  paymentMethod: PaymentMethod;
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

export type PaymentFormErrors = {
  cardName: string;
  cardNumber: string;
  expiryDate: string;
  cvv: string;
};

export function validatePaymentForm(
  values: PaymentFormValues,
): PaymentFormErrors {
  const errors: PaymentFormErrors = {
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  };

  if (values.paymentMethod === "cash") {
    return errors;
  }

  if (!values.cardName.trim()) {
    errors.cardName = "Please enter cardholder name";
  }

  const cleanedCardNumber = values.cardNumber.replace(/\s/g, "");
  if (!/^\d{16}$/.test(cleanedCardNumber)) {
    errors.cardNumber = "Card number must be 16 digits";
  }

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(values.expiryDate)) {
    errors.expiryDate = "Expiry date must be in MM/YY format";
  }

  if (!/^\d{3,4}$/.test(values.cvv)) {
    errors.cvv = "CVV must be 3 or 4 digits";
  }

  return errors;
}

export function hasPaymentErrors(errors: PaymentFormErrors) {
  return Object.values(errors).some(Boolean);
}