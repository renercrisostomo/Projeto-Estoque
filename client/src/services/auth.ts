import { api } from './api';

// Types for backend interaction
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  name: string;
  email: string; // Added email field
}

// Simulate API delay if you want to keep it for testing loading states
// const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount));

export async function signInRequest(data: LoginRequest): Promise<AuthResponse> {
  // await delay(); // Remove or keep delay for testing UI loading states
  // console.log("signInRequest data:", data);
  const response = await api.post<AuthResponse>('/auth/login', data);
  // console.log("signInRequest response:", response.data);
  return response.data; // Backend directly returns AuthResponse structure
}

export async function registerRequest(data: RegisterRequest): Promise<AuthResponse> {
  // await delay(); // Remove or keep delay for testing UI loading states
  // console.log("registerRequest data:", data);
  const response = await api.post<AuthResponse>('/auth/register', data);
  // console.log("registerRequest response:", response.data);
  return response.data;
}

// This function might be used to validate a token and get user info
// if you have a /auth/me or /auth/profile endpoint
export async function recoverUserInformation(): Promise<{ user: { name: string; email?: string; avatar_url?: string } }> {
  // await delay();
  // This is a MOCK. Replace with actual API call if you have an endpoint like /auth/me
  // For now, let's assume it might fetch more details than login/register provides initially
  // const response = await api.get('/auth/me'); 
  // return response.data; 

  // Mocked response, as the current backend doesn't have a /auth/me that returns this structure
  // You would need to implement such an endpoint on the backend if this is desired.
  // Or, adjust what AuthContext expects for the user object based on login/register response.
  console.warn("recoverUserInformation is using MOCKED data. Implement backend endpoint if needed.")
  return {
    user: {
      name: 'Usuário Mock (Recuperado)', // Placeholder
      // email: 'mock@example.com', // Placeholder
      // avatar_url: 'https://github.com/identicons/mock.png' // Placeholder
    }
  };
}