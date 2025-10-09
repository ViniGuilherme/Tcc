import { apiClient } from "@/lib/api-client";
import type { SignInFormData } from "@/schemas/sign-in";
import type { User } from "@/types/user";
import { setCookie } from "@/utils/cookie";

type SignInResponse = User & { accessToken: string }

export async function makeSignIn(data: SignInFormData){
    try {
        const response = await apiClient.post<SignInResponse>('/auth/sign-in', data);
        setCookie('token', response.data.accessToken);
        return response.data;
    } catch (error) {
        throw new Error("Email ou senha incorretos");
    }
}