export interface Petshop {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  location: string;
  services: string[];
  image: string;
  price: string;
  minPrice?: number;
  distance: string;
}

export interface Category {
  name: string;
  icon: string;
  count: number;
}

export interface ServiceDetails {
  id: string;
  name: string;
  description: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
  location: string;
  company: {
    id: string;
    name: string;
    description: string;
    image: string;
  };
  images: string[];
  attributes: {
    duration: string;
    products: string;
    size: string;
  };
}

export interface CompanyDetails {
  id: string;
  name: string;
  description: string;
  rating: number;
  reviews: number;
  location: string;
  address: {
    addressLine: string;
    city: string;
    neighborhood: string;
    state: string;
  };
  contact?: string;
  image?: string;
  services: CompanyService[];
  images: string[];
}

export interface CompanyService {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  isActive: boolean;
}