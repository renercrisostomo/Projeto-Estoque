import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex flex-1">
        <div className="flex flex-col justify-center w-full max-w-md p-8 bg-white shadow-xl rounded-lg mx-auto lg:mx-0 lg:rounded-none lg:shadow-none">
          <div className="mb-8 flex justify-center">
            <Image
              src="/estoque-logo.png"
              alt="Estoque Logo"
              width={150}
              height={50}
              priority
            />
          </div>
          <div className="space-y-6">{children}</div>
        </div>

        <div
          className="hidden lg:flex flex-1 items-center justify-center relative"
          style={{ backgroundColor: '#458ac9' }}
        >
          <div
            className="absolute inset-0 bg-cover bg-center filter brightness-75"
            style={{ backgroundImage: 'url("/background-estoque.webp")' }}
          />
          <div className="relative z-10 text-white text-center px-12">
            <h1 className="text-5xl font-extrabold mb-6 leading-tight">
              Bem-vindo ao Estoque
            </h1>
            <p className="text-lg font-light">
              Gerencie seus produtos de forma eficiente e prática. Simplifique
              sua gestão com nossa plataforma.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
