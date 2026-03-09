export interface PetSitter {
  district: string;
  id: number;
  imgUrl: string;
  latitude: number;
  longitude: number;
  petTypes: string[];
  province: string;
  rating: number;
  sitter: {
    name: string;
    profileImgUrl:string;
    [key: string]: unknown;
  };
  tradeName: string;
}
