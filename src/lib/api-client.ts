import { getCookie } from '@/utils/cookie';
import axios from 'axios';

// Usa proxy local em desenvolvimento para evitar CORS
const baseURL = import.meta.env.DEV 
    ? '/api' 
    : 'https://pet-api-2may.onrender.com';

// Controle de requisições simultâneas
let activeRequests = 0;
const MAX_CONCURRENT_REQUESTS = 5;

export const apiClient = axios.create({
    baseURL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000, // 10 segundos de timeout
});

apiClient.interceptors.request.use(async (config) => {
    // Aguardar se há muitas requisições ativas
    while (activeRequests >= MAX_CONCURRENT_REQUESTS) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    activeRequests++;
    
    const token = getCookie('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
});

apiClient.interceptors.response.use(
    (response) => {
        activeRequests = Math.max(0, activeRequests - 1);
        return response;
    },
    (error) => {
        activeRequests = Math.max(0, activeRequests - 1);
        
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