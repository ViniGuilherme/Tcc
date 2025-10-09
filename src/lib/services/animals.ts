import { apiClient } from "@/lib/api-client";

export interface Animal {
  id?: string;
  name: string;
  breed: string;
  age: string;
  image?: string;
  userId?: string;
}

export interface CreateAnimalData {
  name: string;
  breed: string;
  age: string;
  image?: string;
  userId?: string;
}

export interface AnimalsResponse {
  data: Animal[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetAnimalsParams {
  page?: number;
  limit?: number;
}

export async function createAnimal(data: CreateAnimalData): Promise<Animal> {
  try {
    const response = await apiClient.post<Animal>('/animals', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao criar animal. Tente novamente.');
  }
}

export async function getAnimals(params: GetAnimalsParams = {}): Promise<AnimalsResponse> {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await apiClient.get<AnimalsResponse>(`/animals/user/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar animais. Tente novamente.');
  }
}

export async function getAnimalsByUser(userId: string, params: GetAnimalsParams = {}): Promise<AnimalsResponse> {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await apiClient.get<AnimalsResponse>(`/animals/user/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar animais do usuário. Tente novamente.');
  }
}

export async function getUserAnimals(params: GetAnimalsParams = {}): Promise<AnimalsResponse> {
  try {
    const { page = 1, limit = 10 } = params;
    const response = await apiClient.get<AnimalsResponse>(`/animals/user/?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao buscar seus animais. Tente novamente.');
  }
}

export async function deleteAnimal(animalId: string): Promise<void> {
  try {
    await apiClient.delete(`/animals/${animalId}`);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao deletar animal. Tente novamente.');
  }
}

export async function updateAnimal(animalId: string, data: Partial<CreateAnimalData>): Promise<Animal> {
  try {
    const response = await apiClient.put<Animal>(`/animals/${animalId}`, data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao atualizar animal. Tente novamente.');
  }
}
