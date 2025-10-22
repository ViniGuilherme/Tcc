import { apiClient } from "@/lib/api-client";

export interface Rating {
  id?: string;
  userId: string;
  companyId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRatingData {
  companyId: string;
  rating: number;
  comment?: string;
}

export interface UpdateRatingData {
  rating?: number;
  comment?: string;
}

export interface RatingsResponse {
  data: Rating[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetRatingsParams {
  companyId?: string;
  userId?: string;
  page?: number;
  limit?: number;
}

export interface CompanyStats {
  companyId: string;
  averageRating: number;
  totalRatings: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

export interface EligibilityResponse {
  canRate: boolean;
  reason?: string;
  existingRating?: Rating;
}

export async function createRating(data: CreateRatingData): Promise<Rating> {
  try {
    const response = await apiClient.post<Rating>('/ratings', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao criar avaliação. Tente novamente.');
  }
}

export async function getRatings(params: GetRatingsParams = {}): Promise<RatingsResponse> {
  try {
    const { companyId, userId, page = 1, limit = 10 } = params;
    const searchParams = new URLSearchParams();
    
    if (companyId) searchParams.append('companyId', companyId);
    if (userId) searchParams.append('userId', userId);
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    const response = await apiClient.get<RatingsResponse>(`/ratings?${searchParams.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar avaliações. Tente novamente.');
  }
}

export async function getCompanyRatings(companyId: string, params: Omit<GetRatingsParams, 'companyId'> = {}): Promise<RatingsResponse> {
  try {
    const { page = 1, limit = 10 } = params;
    const searchParams = new URLSearchParams();
    
    searchParams.append('companyId', companyId);
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    const response = await apiClient.get<RatingsResponse>(`/ratings/company/?${searchParams.toString()}`);
    return response.data;
  } catch (error: any) {
    return {
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    };
  }
}

export async function getUserRatings(userId: string, params: Omit<GetRatingsParams, 'userId'> = {}): Promise<RatingsResponse> {
  try {
    return await getRatings({ ...params, userId });
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar suas avaliações. Tente novamente.');
  }
}

export async function listCompanyRatings(params: { page?: number; limit?: number } = {}): Promise<RatingsResponse> {
  try {
    const { page = 1, limit = 10 } = params;
    const searchParams = new URLSearchParams();
    
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    const response = await apiClient.get<RatingsResponse>(`/ratings/company/?${searchParams.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao listar avaliações. Tente novamente.');
  }
}

export async function updateRating(ratingId: string, data: UpdateRatingData): Promise<Rating> {
  try {
    const response = await apiClient.put<Rating>(`/ratings/${ratingId}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao atualizar avaliação. Tente novamente.');
  }
}

export async function deleteRating(ratingId: string): Promise<void> {
  try {
    await apiClient.delete(`/ratings/${ratingId}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao deletar avaliação. Tente novamente.');
  }
}

export async function getCompanyStats(companyId: string): Promise<CompanyStats> {
  try {
    const response = await apiClient.get<CompanyStats>(`/ratings/company/${companyId}/stats`);
    return response.data;
  } catch (error: any) {
    console.error('Erro na API de estatísticas:', error);
    
    // Se o endpoint não existir (404), retornar dados vazios
    if (error.response?.status === 404) {
      return {
        companyId,
        averageRating: 0,
        totalRatings: 0,
        ratingDistribution: {
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0
        }
      };
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar estatísticas da empresa. Tente novamente.');
  }
}

export async function checkUserEligibility(companyId: string): Promise<EligibilityResponse> {
  try {
    const response = await apiClient.get<EligibilityResponse>(`/ratings/company/${companyId}/eligibility`);
    return response.data;
  } catch (error: any) {
    console.error('Erro na API de elegibilidade:', error);
    
    // Se o endpoint não existir (404), assumir que o usuário pode avaliar
    if (error.response?.status === 404) {
      return {
        canRate: true,
        reason: 'Endpoint não disponível'
      };
    }
    
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao verificar elegibilidade. Tente novamente.');
  }
}
