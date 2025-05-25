"use client";

import Head from 'next/head';
import { useContext } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import next/image
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { user, isLoading } = useContext(AuthContext);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Head>
        <title>Home - Gestor de Estoque</title>
      </Head>

      <div className="max-w-md w-full space-y-8 text-center">
        <Image // Use next/image component
          className="mx-auto h-20 w-auto"
          src="/estoque-logo.png"
          alt="Gestor de Estoque"
          width={80} // Specify width
          height={80} // Specify height
        />
        <h1 className="mt-6 text-4xl font-extrabold text-gray-900">
          Bem-vindo ao Gestor de Estoque
        </h1>

        {isLoading && (
          <p className="text-lg text-gray-700">Carregando...</p>
        )}

        {!isLoading && user && (
          <>
            <p className="text-xl text-gray-700">
              Olá, {user.name || user.email}!
            </p>
            <Link href="/dashboard" legacyBehavior>
              <a className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Ir para o Dashboard
              </a>
            </Link>
          </>
        )}

        {!isLoading && !user && (
          <>
            <p className="text-lg text-gray-700">
              Faça login para gerenciar seu inventário.
            </p>
            <Link href="/auth/login" legacyBehavior>
              <a className="mt-8 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Fazer Login
              </a>
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
