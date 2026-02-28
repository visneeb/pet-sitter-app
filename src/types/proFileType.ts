export interface UpdateBasicProfilePayload {
  name: string;
  phone: string;
}

export interface UpdateEmailProfilePayload {
  name: string;
  phone: string;
  email: string;
  password?: string;
}
