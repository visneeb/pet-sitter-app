export type Role = "customer" | "sitter";

export type RegisterFormValues = {
  email: string;
  phone: string;
  password: string;
};

export type LoginFormValues = {
  email: string;
  password: string;
};
