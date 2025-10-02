import { apiClient } from "@/lib/api-client";

export interface Breed {
  id: string;
  name: string;
  species: string;
  description?: string;
}

export interface BreedsResponse {
  data: Breed[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetBreedsParams {
  query?: string;
  species?: string;
  page?: number;
  limit?: number;
}

export async function getBreeds(params: GetBreedsParams = {}): Promise<BreedsResponse> {
  try {
    const { query, species, page = 1, limit = 100 } = params;
    const searchParams = new URLSearchParams();
    
    if (query) searchParams.append('query', query);
    if (species) searchParams.append('species', species);
    searchParams.append('page', page.toString());
    searchParams.append('limit', limit.toString());
    
    const response = await apiClient.get<BreedsResponse>(`/breeds?${searchParams.toString()}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar raças. Tente novamente.');
  }
}

export async function searchBreeds(query: string): Promise<Breed[]> {
  try {
    const response = await getBreeds({ query, limit: 50 });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar raças:', error);
    return [];
  }
}

export async function getBreedsBySpecies(species: string): Promise<Breed[]> {
  try {
    const response = await getBreeds({ species, limit: 100 });
    return response.data;
  } catch (error: any) {
    console.error('Erro ao buscar raças por espécie:', error);
    return [];
  }
}
