export interface ApidogModel {
  items: Item[];
  meta: Meta;
}

export interface Item {
  address: Address;
  contact?: null | string;
  id: string;
  image?: Image;
  name: string;
  averageRating?: number;
  ratingCount?: number;
  description?: string;
}

export interface Address {
  addressLine: string;
  city: string;
  complement: null | string;
  country: string;
  id: string;
  latitude: number;
  longitude: number;
  neighborhood: string;
  number: string;
  postalCode: string;
  state: string;
}

export interface Image {
  id: string;
  url: string;
}

export interface Meta {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
}