export type Pet = {
    id: string;
    name: string;
    type: string;
    imgUrl?: string;
  };
  
  export type Sitter = {
    id: string;
    name: string;
    acceptedTypes: string[];
  };