import { api } from './api';
import axios from 'axios'; // Ensure axios is imported for the type guard

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

export interface MessageDTO {
  message: string;
}

export const signInRequest = async (data: LoginRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Attempt to get the specific message from backend (MessageDTO)
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        throw new Error(error.response.data.message);
      }
      // If no specific MessageDTO, use Axios's own error message (e.g., "Request failed with status code 401")
      // This is often more informative than a generic "unexpected error".
      if (error.message) {
        throw new Error(error.message);
      }
    } else if (error instanceof Error) {
      // For non-Axios errors that are still Error instances
      if (error.message) {
        throw new Error(error.message);
      }
    }
    // Absolute fallback if no other message could be derived
    throw new Error('Ocorreu um erro inesperado ao tentar fazer login.');
  }
};

export const registerRequest = async (data: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Attempt to get the specific message from backend (MessageDTO)
      if (error.response && error.response.data && typeof error.response.data.message === 'string') {
        throw new Error(error.response.data.message);
      }
      // If no specific MessageDTO, use Axios's own error message
      if (error.message) {
        throw new Error(error.message);
      }
    } else if (error instanceof Error) {
      // For non-Axios errors that are still Error instances
      if (error.message) {
        throw new Error(error.message);
      }
    }
    // Absolute fallback if no other message could be derived
    throw new Error('Ocorreu um erro inesperado ao tentar realizar o cadastro.');
  }
};

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