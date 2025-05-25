"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { useRouter, usePathname } from 'next/navigation'; // Import usePathname
import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode'; // Import jwtDecode and JwtPayload

import { api } from '../services/api';
import { AuthResponse, LoginRequest, RegisterRequest, signInRequest, registerRequest } from '../services/auth';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean; // Add isLoading here
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => void;
}

interface DecodedToken extends JwtPayload {
  name: string;
  email: string;
  // Add other fields your token might have, e.g., roles, userId
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Add isLoading state
  const router = useRouter();
  const pathname = usePathname(); // Get current pathname

  const isAuthenticated = !!user; // Definition of isAuthenticated

  const signIn = useCallback(async (data: LoginRequest) => {
    setIsLoading(true); // Set loading true
    try {
      const response: AuthResponse = await signInRequest(data);
      // Assuming AuthResponse now correctly includes email as per previous step
      const { token, name, email } = response; 
  
      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });
  
      api.defaults.headers['Authorization'] = `Bearer ${token}`;
      setUser({ name, email }); // Ensure email is included
      router.push('/dashboard');
    } catch (error) {
      console.error('AuthContext: Erro no signIn:', error);
      throw error;
    } finally {
      setIsLoading(false); // Set loading false
    }
  }, [router]);

  const signUp = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true); // Set loading true
    try {
      const response = await registerRequest(data);
      const { token, name, email } = response; // Assuming AuthResponse has name and email

      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      setUser({ name, email }); // Adjust if your AuthResponse or User type is different
      api.defaults.headers['Authorization'] = `Bearer ${token}`;

      router.push('/dashboard');
    } catch (err) {
      // Handle error (e.g., display notification to user)
      console.error("Registration failed:", err);
      // Rethrow or handle as appropriate for your UI
      if (axios.isAxiosError(err) && err.response) {
        throw new Error(err.response.data.message || 'Erro ao registrar. Tente novamente.');
      }
      throw new Error('Erro ao registrar. Tente novamente.');
    } finally {
      setIsLoading(false); // Set loading false
    }
  }, [router]);

  const signOut = useCallback(() => {
    setIsLoading(true); // Set loading true
    destroyCookie(undefined, 'auth.token');
    delete api.defaults.headers['Authorization'];
    setUser(null);
    router.push('/auth/login');
    setIsLoading(false); // Set loading false
  }, [router]);

  useEffect(() => {
    const { 'auth.token': token } = parseCookies();
    setIsLoading(true); // Set loading true at the start of effect
    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);

        const currentTime = Date.now() / 1000;
        if (decodedToken.exp && decodedToken.exp < currentTime) {
          destroyCookie(undefined, 'auth.token');
          delete api.defaults.headers['Authorization'];
          setUser(null);
          router.push('/auth/login'); // Redirect to login if token is expired
        } else {
          api.defaults.headers['Authorization'] = `Bearer ${token}`;
          setUser({ name: decodedToken.name, email: decodedToken.email });
        }
      } catch (error) {
        console.error("Failed to decode token:", error);
        destroyCookie(undefined, 'auth.token');
        delete api.defaults.headers['Authorization'];
        setUser(null);
        router.push('/auth/login'); // Redirect to login if token is invalid
      }
    } else if (!pathname.startsWith('/auth')) { // If no token and not on auth pages, redirect to login
      // router.push('/auth/login'); // Commented out to prevent redirect loop if already on /
    }
    setIsLoading(false); // Set loading false at the end of effect
  }, [router, pathname]); // Add pathname to dependency array

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, signOut, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}