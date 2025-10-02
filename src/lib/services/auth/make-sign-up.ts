import { apiClient } from "@/lib/api-client";
import type { SignUpFormData } from "@/schemas/sign-up";
import type { User } from "@/types/user";
import { setCookie } from "@/utils/cookie";

type SignUpResponse = User & { accessToken: string }

export async function makeSignUp(data: SignUpFormData){
    try {
        const response = await apiClient.post<SignUpResponse>('/auth/sign-up', data);
        setCookie('token', response.data.accessToken);
        return response.data;
    } catch (error: any) {
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        }
        throw new Error("Erro ao criar conta. Tente novamente.");
    }
}