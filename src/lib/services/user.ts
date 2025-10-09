import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export async function updateUser(data: UpdateUserData): Promise<User> {
  try {
    const response = await apiClient.put<User>('/users/edit', data);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao atualizar perfil. Tente novamente.');
  }
}

export async function changePassword(data: ChangePasswordData): Promise<void> {
  try {
    await apiClient.put('/users/change-password', data);
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao alterar senha. Tente novamente.');
  }
}

export async function deleteAccount(): Promise<void> {
  try {
    await apiClient.delete('/users/delete');
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao excluir conta. Tente novamente.');
  }
}

export async function uploadAvatar(file: File): Promise<{ avatarUrl: string }> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await apiClient.patch<{ avatarUrl: string }>('/users/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao fazer upload do avatar. Tente novamente.');
  }
}

export async function deleteAvatar(): Promise<void> {
  try {
    await apiClient.delete('/users/avatar');
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Erro ao remover avatar. Tente novamente.');
  }
}
