import { getCookie } from '@/utils/cookie';
import axios from 'axios';

// Usa proxy local em desenvolvimento para evitar CORS
const baseURL = import.meta.env.DEV 
    ? '/api' 
    : 'https://pet-api-2may.onrender.com';

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use((config) => {
    const token = getCookie('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            // Remove o token inválido
            document.cookie = 'token=; Max-Age=0; path=/;';
            // Só redireciona se não estiver já na página de login
            if (window.location.pathname !== '/entrar') {
                window.location.href = '/entrar';
            }
        }
        return Promise.reject(error);
    }
);