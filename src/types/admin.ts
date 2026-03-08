export type OwnerStatus = "Normal" | "Banned";

export interface OwnerItem {
  id: string;
  name: string;
  phone: string;
  profileImgUrl: string | null;
  email: string;
  status: OwnerStatus;
  petCount: number;
}

export interface OwnerListResponse {
  totalOwners: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  owners: OwnerItem[];
}

export interface GetOwnerListParams {
  seed?: string;
  page: number;
  limit: number;
  keyword?: string;
  status?: OwnerStatus;
}
