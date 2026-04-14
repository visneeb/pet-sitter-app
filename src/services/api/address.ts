import { publicApi } from "./client";

export type Province = {
  provinceId: number;
  name: string;
};

export type District = {
  districtId: number;
  provinceId: number;
  name: string;
};

export type SubDistrict = {
  subDistrictId: number;
  districtId: number;
  name: string;
  postCode: number;
};

export const addressApi = {
  getProvinces: (): Promise<Province[]> =>
    publicApi.get("/address/provinces").then((res) => res.data),

  getDistrictsByProvince: (provinceId: number): Promise<District[]> =>
    publicApi
      .get(`/address/provinces/${provinceId}/districts`)
      .then((res) => res.data),

  getSubDistrictsByDistrict: (districtId: number): Promise<SubDistrict[]> =>
    publicApi
      .get(`/address/districts/${districtId}/sub-districts`)
      .then((res) => res.data),
};
