import { apiClient } from '../api-client';
import type { ServiceDetails, CompanyDetails, CompanyService } from '../../types/petshop';
import { companyCache } from './company-cache';

interface ApiServiceResponse {
  id: string;
  name: string;
  description: string;
  duration: number;
  price: number;
  companyId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface ApiCompanyResponse {
  id: string;
  name: string;
  description: string;
  address: {
    addressLine: string;
    city: string;
    neighborhood: string;
    state: string;
  };
  contact?: string;
  image?: {
    id: string;
    url: string;
  };
}

const fetchServiceById = async (serviceId: string): Promise<ApiServiceResponse> => {
  try {
    const response = await apiClient.get(`/services/${serviceId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviço:', error);
    throw error;
  }
};

const fetchCompanyById = async (companyId: string): Promise<ApiCompanyResponse> => {
  try {
    const response = await apiClient.get(`/companies/${companyId}`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar empresa:', error);
    throw error;
  }
};

const mockServiceDetails: ServiceDetails = {
  id: "1",
  name: "Banho Premium com Hidratação Profunda",
  description: "Proporcione ao seu melhor amigo uma experiência de banho revitalizante. Nosso serviço de Banho Premium utiliza produtos hipoalergênicos de alta qualidade, garantindo uma limpeza suave e eficaz. A hidratação profunda restaura a maciez e o brilho da pelagem, enquanto o corte de unhas e a limpeza de ouvidos completam o cuidado. Tudo realizado por profissionais apaixonados e em um ambiente seguro e climatizado.",
  duration: "1h 30min",
  price: "R$ 95,00",
  rating: 4.8,
  reviews: 124,
  location: "Patinhas Felizes, Vila Madalena, São Paulo",
  company: {
    id: "1",
    name: "Patinhas Felizes",
    description: "A Patinhas Felizes nasceu do amor incondicional pelos animais. Somos mais do que um pet shop, somos um espaço de bem-estar e cuidado, dedicado a oferecer os melhores serviços para o seu companheiro. Nossa equipe é formada por profissionais qualificados e apaixonados, prontos para tratar seu pet com o carinho e o respeito que ele merece.",
    image: "/api/placeholder/100/100"
  },
  images: [
    "/api/placeholder/600/400",
    "/api/placeholder/600/400"
  ],
  attributes: {
    duration: "Aprox. 1h 30min",
    products: "Hipoalergênicos",
    size: "Pequeno e Médio"
  }
};

const fetchServicesByCompany = async (companyId: string): Promise<CompanyService[]> => {
  try {
    const response = await apiClient.get(`/companies/${companyId}/services`);
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar serviços da empresa:', error);
    throw error;
  }
};

export const fetchServiceDetails = async (serviceId: string): Promise<ServiceDetails> => {
  try {
    console.log('Buscando serviço com ID:', serviceId);
    
    const service = await fetchServiceById(serviceId);
    console.log('Serviço encontrado na API:', service);
    
    const company = await fetchCompanyById(service.companyId);
    console.log('Empresa encontrada na API:', company);
    
    const serviceDetails: ServiceDetails = {
      id: service.id,
      name: service.name,
      description: service.description,
      duration: `${service.duration}min`,
      price: `R$ ${service.price.toFixed(2).replace('.', ',')}`,
      rating: 4.5,
      reviews: 10,
      location: `${company.address.neighborhood}, ${company.address.city}, ${company.address.state}`,
      company: {
        id: company.id,
        name: company.name,
        description: company.description || 'Empresa especializada em cuidados para pets.',
        image: company.image?.url || '/api/placeholder/100/100'
      },
      images: company.image?.url ? [company.image.url] : ['/api/placeholder/600/400'],
      attributes: {
        duration: `Aprox. ${service.duration}min`,
        products: 'Profissionais',
        size: 'Todos os portes'
      }
    };
    
    console.log('Dados mapeados da API:', serviceDetails);
    return serviceDetails;
    
  } catch (error) {
    console.error('Erro ao buscar dados da API, usando fallback:', error);
    return mockServiceDetails;
  }
};

export const fetchCompanyDetails = async (companyId: string): Promise<CompanyDetails> => {
  try {
    console.log('🔍 Buscando empresa com ID:', companyId);
    
    const cachedCompany = companyCache.getCompany(companyId);
    if (cachedCompany) {
      console.log('✅ Empresa encontrada no cache:', cachedCompany);
      
      const companyDetails: CompanyDetails = {
        id: cachedCompany.id,
        name: cachedCompany.name,
        description: 'Empresa especializada em cuidados para pets. Oferecemos banho, tosa e diversos serviços para o bem-estar do seu animal.',
        rating: cachedCompany.rating,
        reviews: cachedCompany.reviews,
        location: cachedCompany.location,
        address: {
          addressLine: cachedCompany.location.split(',')[0] || 'Endereço não informado',
          city: 'São Paulo',
          neighborhood: cachedCompany.location.split(',')[0] || 'Bairro não informado',
          state: 'SP'
        },
        contact: '(11) 99999-9999',
        image: cachedCompany.image,
        services: [
          {
            id: `${cachedCompany.id}-1`,
            name: "Banho Premium com Hidratação",
            description: "Banho completo com produtos hipoalergênicos e hidratação profunda",
            duration: 90,
            price: 95.00,
            isActive: true
          },
          {
            id: `${cachedCompany.id}-2`,
            name: "Banho Simples",
            description: "Banho básico com shampoo e condicionador",
            duration: 60,
            price: 65.00,
            isActive: true
          },
          {
            id: `${cachedCompany.id}-3`,
            name: "Tosa Higiênica",
            description: "Tosa focada na higiene e conforto do pet",
            duration: 45,
            price: 45.00,
            isActive: true
          },
          {
            id: `${cachedCompany.id}-4`,
            name: "Tosa Completa",
            description: "Tosa completa com banho e secagem",
            duration: 120,
            price: 120.00,
            isActive: true
          }
        ],
        images: [cachedCompany.image, '/api/placeholder/600/400']
      };
      
      console.log('Dados da empresa mapeados do cache:', companyDetails);
      return companyDetails;
    }
    
    const company = await fetchCompanyById(companyId);
    console.log('✅ Empresa encontrada na API:', company);
    
    const services = await fetchServicesByCompany(companyId);
    console.log('✅ Serviços da empresa encontrados:', services);
    
    const companyDetails: CompanyDetails = {
      id: company.id,
      name: company.name,
      description: company.description || 'Empresa especializada em cuidados para pets.',
      rating: 4.5,
      reviews: 10,
      location: `${company.address.neighborhood}, ${company.address.city}, ${company.address.state}`,
      address: company.address,
      contact: company.contact,
      image: company.image?.url,
      services: services.filter(service => service.isActive),
      images: company.image?.url ? [company.image.url] : ['/api/placeholder/600/400']
    };
    
    console.log('Dados da empresa mapeados da API:', companyDetails);
    return companyDetails;
    
  } catch (error) {
    console.error('❌ Erro ao buscar dados da empresa, usando fallback:', error);
    console.log('🔄 Retornando dados mock para ID:', companyId);
    return getMockCompanyDetails(companyId);
  }
};

const getMockCompanyDetails = (companyId: string): CompanyDetails => {
  const companies = {
    "1": {
      name: "Pet Shop Vila Madalena",
      description: "Especializados em cuidados completos para seu pet há mais de 10 anos. Oferecemos banho, tosa, consultas veterinárias e uma linha completa de produtos para o bem-estar do seu animal.",
      rating: 4.8,
      reviews: 124,
      location: "Vila Madalena, São Paulo - SP",
      address: {
        addressLine: "Rua Harmonia, 456",
        city: "São Paulo",
        neighborhood: "Vila Madalena",
        state: "SP"
      },
      contact: "(11) 99999-9999",
      minPrice: 45.00
    },
    "2": {
      name: "Animal Center Jardins",
      description: "Centro veterinário e pet shop completo. Nossa equipe é formada por profissionais qualificados e apaixonados por animais, prontos para oferecer os melhores cuidados.",
      rating: 4.6,
      reviews: 89,
      location: "Jardins, São Paulo - SP",
      address: {
        addressLine: "Alameda Santos, 1000",
        city: "São Paulo",
        neighborhood: "Jardins",
        state: "SP"
      },
      contact: "(11) 88888-8888",
      minPrice: 50.00
    },
    "3": {
      name: "Pet Care Pinheiros",
      description: "Há mais de 15 anos cuidando com carinho e dedicação dos seus pets. Oferecemos serviços de banho, tosa, hotel para pets e consultas veterinárias.",
      rating: 4.9,
      reviews: 156,
      location: "Pinheiros, São Paulo - SP",
      address: {
        addressLine: "Rua Teodoro Sampaio, 500",
        city: "São Paulo",
        neighborhood: "Pinheiros",
        state: "SP"
      },
      contact: "(11) 77777-7777",
      minPrice: 40.00
    },
    "4": {
      name: "Pet House Bela Vista",
      description: "Pet shop moderno e completo, oferecendo banho, tosa, produtos e serviços veterinários. Nossa missão é proporcionar o melhor cuidado para seu pet.",
      rating: 4.7,
      reviews: 98,
      location: "Bela Vista, São Paulo - SP",
      address: {
        addressLine: "Rua da Consolação, 2500",
        city: "São Paulo",
        neighborhood: "Bela Vista",
        state: "SP"
      },
      contact: "(11) 66666-6666",
      minPrice: 55.00
    },
    "5": {
      name: "Casa do Pet Itaim",
      description: "Especializados em banho, tosa e cuidados especiais para pets. Nossa equipe é treinada para tratar seu animal com muito carinho e profissionalismo.",
      rating: 4.5,
      reviews: 67,
      location: "Itaim Bibi, São Paulo - SP",
      address: {
        addressLine: "Rua Bandeira Paulista, 800",
        city: "São Paulo",
        neighborhood: "Itaim Bibi",
        state: "SP"
      },
      contact: "(11) 55555-5555",
      minPrice: 60.00
    },
    "6": {
      name: "Pet Spa Moema",
      description: "Spa completo para pets! Oferecemos banho terapêutico, tosa artística, hidratação e tratamentos especiais para o bem-estar do seu animal.",
      rating: 4.9,
      reviews: 203,
      location: "Moema, São Paulo - SP",
      address: {
        addressLine: "Av. Ibirapuera, 3000",
        city: "São Paulo",
        neighborhood: "Moema",
        state: "SP"
      },
      contact: "(11) 44444-4444",
      minPrice: 80.00
    },
    "7": {
      name: "Pet Shop Vila Olímpia",
      description: "Pet shop completo com banho, tosa, produtos e serviços veterinários. Atendemos com excelência há mais de 8 anos na região.",
      rating: 4.4,
      reviews: 45,
      location: "Vila Olímpia, São Paulo - SP",
      address: {
        addressLine: "Rua Funchal, 1200",
        city: "São Paulo",
        neighborhood: "Vila Olímpia",
        state: "SP"
      },
      contact: "(11) 33333-3333",
      minPrice: 65.00
    },
    "8": {
      name: "Animal Care Centro",
      description: "Centro de cuidados para pets no coração de São Paulo. Oferecemos banho, tosa, consultas e uma variedade de produtos para seu animal.",
      rating: 4.6,
      reviews: 112,
      location: "Centro, São Paulo - SP",
      address: {
        addressLine: "Rua Augusta, 1500",
        city: "São Paulo",
        neighborhood: "Centro",
        state: "SP"
      },
      contact: "(11) 22222-2222",
      minPrice: 35.00
    }
  };

  const company = companies[companyId as keyof typeof companies] || companies["1"];

  return {
    id: companyId,
    name: company.name,
    description: company.description,
    rating: company.rating,
    reviews: company.reviews,
    location: company.location,
    address: company.address,
    contact: company.contact,
    image: "/api/placeholder/100/100",
    services: [
      {
        id: `${companyId}-1`,
        name: "Banho Premium com Hidratação",
        description: "Banho completo com produtos hipoalergênicos e hidratação profunda",
        duration: 90,
        price: 95.00,
        isActive: true
      },
      {
        id: `${companyId}-2`,
        name: "Banho Simples",
        description: "Banho básico com shampoo e condicionador",
        duration: 60,
        price: 65.00,
        isActive: true
      },
      {
        id: `${companyId}-3`,
        name: "Tosa Higiênica",
        description: "Tosa focada na higiene e conforto do pet",
        duration: 45,
        price: company.minPrice || 45.00,
        isActive: true
      },
      {
        id: `${companyId}-4`,
        name: "Tosa Completa",
        description: "Tosa completa com banho e secagem",
        duration: 120,
        price: 120.00,
        isActive: true
      }
    ],
    images: [
      "/api/placeholder/600/400",
      "/api/placeholder/600/400"
    ]
  };
};
