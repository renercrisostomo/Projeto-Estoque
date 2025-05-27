"use client";

import { createContext, useEffect, useState, useCallback } from "react";
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import { useRouter, usePathname } from 'next/navigation';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { notification as antdNotification } from 'antd'; // Renamed to avoid conflict

import { api as axiosApi } from '../services/api'; // Renamed api to axiosApi to avoid conflict
import { AuthResponse, LoginRequest, RegisterRequest, signInRequest, registerRequest } from '../services/auth';

interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  signIn: (data: LoginRequest) => Promise<void>;
  signUp: (data: RegisterRequest) => Promise<void>;
  signOut: () => void;
}

interface DecodedToken extends JwtPayload {
  name: string;
  email: string;
}

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const [notificationApi, contextHolder] = antdNotification.useNotification(); // Use the hook

  const isAuthenticated = !!user;

  const signIn = useCallback(async (data: LoginRequest) => {
    setIsLoading(true);
    try {
      const response: AuthResponse = await signInRequest(data);
      const { token, name, email } = response;

      setCookie(undefined, 'auth.token', token, {
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: '/',
      });

      axiosApi.defaults.headers['Authorization'] = `Bearer ${token}`; // Use renamed axiosApi
      setUser({ name, email });
      router.push('/dashboard');
      notificationApi.success({ message: 'Login realizado com sucesso!' }); // Use notificationApi
    } catch (error) {
      console.error('AuthContext: Erro no signIn:', error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
      notificationApi.error({ message: 'Erro no Login', description: errorMessage }); // Use notificationApi
    } finally {
      setIsLoading(false);
    }
  }, [router, notificationApi]); // Add notificationApi to dependencies

  const signUp = useCallback(async (data: RegisterRequest) => {
    setIsLoading(true);
    try {
      // Call the registration service but don't automatically log in
      await registerRequest(data);

      // Redirect to login page after successful registration
      router.push('/auth/login');
      notificationApi.success({
        message: 'Cadastro realizado com sucesso!',
        description: 'Por favor, faça login para continuar.'
      });
    } catch (error) {
      console.error("Registration failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro inesperado.';
      notificationApi.error({ message: 'Erro no Cadastro', description: errorMessage });
    } finally {
      setIsLoading(false);
    }
  }, [router, notificationApi]); // Add notificationApi to dependencies

  const signOut = useCallback(() => {
    setIsLoading(true);
    try {
      destroyCookie(undefined, 'auth.token', { path: '/' }); // Added path
      delete axiosApi.defaults.headers['Authorization']; // Use renamed axiosApi
      setUser(null);
      router.push('/auth/login');
      notificationApi.info({ message: 'Logout realizado com sucesso.' }); // Use notificationApi
    } catch (error) {
      console.error("SignOut failed:", error);
      const errorMessage = error instanceof Error ? error.message : 'Ocorreu um erro ao tentar fazer logout.';
      notificationApi.error({ message: 'Erro ao sair', description: errorMessage }); // Use notificationApi
    } finally {
      setIsLoading(false);
    }
  }, [router, notificationApi]); // Add notificationApi to dependencies

  useEffect(() => {
    const { 'auth.token': token } = parseCookies();
    setIsLoading(true);

    if (token) {
      try {
        const decodedToken = jwtDecode<DecodedToken>(token);
        const currentTime = Date.now() / 1000;

        if (decodedToken.exp && decodedToken.exp < currentTime) {
          // Token is expired
          destroyCookie(undefined, 'auth.token', { path: '/' }); // Added path
          delete axiosApi.defaults.headers['Authorization']; // Use renamed axiosApi
          setUser(null);
          // If on a protected page, redirect to login and notify.
          // If on an auth page, just clear the token and let them proceed.
          if (!pathname.startsWith('/auth')) {
            router.push('/auth/login');
            notificationApi.warning({ message: 'Sessão expirada', description: 'Sua sessão expirou. Por favor, faça login novamente.' });
          }
        } else {
          // Token is valid
          axiosApi.defaults.headers['Authorization'] = `Bearer ${token}`; // Use renamed axiosApi
          setUser({ name: decodedToken.name, email: decodedToken.email });
          // If user with a valid token is on login/register, redirect to dashboard
          if (pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register')) {
            router.push('/dashboard');
          }
        }
      } catch (error) {
        // Token is invalid (e.g., malformed)
        console.error("Failed to decode token:", error);
        destroyCookie(undefined, 'auth.token', { path: '/' }); // Added path
        delete axiosApi.defaults.headers['Authorization']; // Use renamed axiosApi
        setUser(null);
        // If on a protected page, redirect to login and notify.
        // If on an auth page, just clear the token and let them proceed.
        if (!pathname.startsWith('/auth')) {
          router.push('/auth/login');
          notificationApi.error({ message: 'Erro de Autenticação', description: 'Não foi possível validar sua sessão. Por favor, faça login novamente.' });
        }
      }
    } else {
      // No token exists.
      // If trying to access a protected page (not /auth/*) without a token, redirect to login.
      // Allow access to /auth/* pages.
      if (!pathname.startsWith('/auth')) {
        router.push('/auth/login');
        // Consider if a notification is needed for direct access attempts to protected pages without a token.
        // Example: notificationApi.info({ message: 'Acesso Negado', description: 'Você precisa estar logado para acessar esta página.' });
      }
    }
    setIsLoading(false);
  }, [router, pathname, notificationApi]); // Add notificationApi to dependencies

  return (
    <>
      {contextHolder} {/* Render contextHolder here */}
      <AuthContext.Provider value={{ isAuthenticated, user, signIn, signUp, signOut, isLoading }}>
        {children}
      </AuthContext.Provider>
    </>
  );
}
