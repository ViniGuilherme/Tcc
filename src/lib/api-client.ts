import { getCookie } from '@/utils/cookie';
import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'https://pet-api-2may.onrender.com',
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
        if (error.response && error.response.status === 403) {
            document.cookie = 'token=; Max-Age=0; path=/;';
            window.location.href = '/entrar';
        }
        return Promise.reject(error);
    }
);