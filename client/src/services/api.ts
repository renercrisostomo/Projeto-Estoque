import axios from 'axios';
import { parseCookies } from 'nookies';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
});

// Adiciona um interceptor para incluir o token JWT nas requisições, se disponível
api.interceptors.request.use(async config => {
  try {
    const cookies = parseCookies();
    const token = cookies['auth.token'];
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.warn('Erro ao obter token de autenticação:', error);
  }
  
  return config;
});

console.log('API Base URL:', api.defaults.baseURL);