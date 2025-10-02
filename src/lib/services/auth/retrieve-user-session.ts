import { apiClient } from "@/lib/api-client";
import type { User } from "@/types/user";
import { getCookie } from "@/utils/cookie";

export async function retrieveUserSession() {
    const token = getCookie('token');
    
    if (!token) {
        return null;
    }
    
    try {
        const response = await apiClient.get<User>("/auth/session");
        return response.data;
    } catch (error) {
        return null;
    }
}