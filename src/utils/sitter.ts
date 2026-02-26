import { Sitter, SitterApi } from "@/types/sitter";

export function toSitter(sitterApi: SitterApi): Sitter {
  return {
    id: sitterApi.id,
    sitter: {
      name: sitterApi.sitter.name,
      profileImgUrl: sitterApi.sitter.profileImgUrl ?? null,
    },
    imgUrls: sitterApi.imgUrls ?? null,
    imgUrl: sitterApi.imgUrl ?? null,
    tradeName: sitterApi.tradeName ?? null,
    experience: sitterApi.experience ?? null,
    rating: sitterApi.rating ?? null,
    petTypes: sitterApi.petTypes,
    introduction: sitterApi.introduction ?? null,
    services: sitterApi.services ?? null,
    description: sitterApi.description ?? null,
    address: sitterApi.address ?? null,
    latitude: sitterApi.latitude ?? null,
    longitude: sitterApi.longitude ?? null,
    province: sitterApi.province ?? null,
    district: sitterApi.district ?? null,
    subDistrict: sitterApi.subDistrict ?? null,
    postCode: sitterApi.postCode ?? null,
  };
}

export function mapToSitter(sitterApi: SitterApi[]): Sitter[] {
  return sitterApi.map(toSitter);
}
