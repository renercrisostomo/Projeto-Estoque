import React from 'react';
import Image from 'next/image';
import backgroundImageSrc from '@/../public/background-estoque.png';


export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Imagem de Fundo com Desfoque e Overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageSrc.src})` }}
      >
        {/* Overlay para escurecer e filtro de desfoque */}
        <div className="absolute inset-0 bg-black opacity-30 backdrop-blur-md"></div>
      </div>

      {/* Card de Autenticação Centralizado */}
      <div className="relative z-10 w-full max-w-md transform space-y-6 rounded-xl bg-white bg-opacity-90 px-8 py-4 shadow-2xl transition-all sm:space-y-8 sm:px-10 sm:py-4">
        {/* Logo */}
        <div className="flex justify-center">
          <Image
            src="/estoque-logo.png"
            alt="Estoque Logo"
            width={150}
            height={50}
            priority
          />
        </div>
        {/* Formulário (Login/Register) */}
        <div>{children}</div>
      </div>
    </div>
  );
}