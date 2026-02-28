export type Role = "owner" | "sitter";

export type RegisterFormValues = {
  email: string;
  phone: string;
  password: string;
  role: Role;
};

export type LoginFormValues = {
  email: string;
  password: string;
  remember?: boolean;
};
