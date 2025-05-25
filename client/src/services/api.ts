import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api', // Default to Next.js API routes if not set
});

// Adiciona um interceptor para incluir o token JWT nas requisições, se disponível
api.interceptors.request.use(async config => {
  // Não precisamos mais buscar o token do localStorage aqui se o AuthContext já o gerencia
  // e o serviço de autenticação o armazena/remove.
  // A lógica de adicionar o token pode ser mais centralizada ou gerenciada pelo AuthContext/serviços específicos.
  
  // Exemplo de como poderia ser se o token estivesse acessível globalmente ou via um getter:
  // const token = getTokenFromSomeplace(); 
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

// Verifica se NEXT_PUBLIC_API_URL está definido e loga um aviso se não estiver, 
// pois o backend Java deve ser o alvo principal.
if (!process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    'NEXT_PUBLIC_API_URL não está definida. As chamadas de API serão direcionadas para /api (Next.js routes) por padrão. Configure-a para http://localhost:8080 se o backend Java estiver nessa porta.'
  );
} else {
  console.log('API calls will be directed to:', process.env.NEXT_PUBLIC_API_URL);
}