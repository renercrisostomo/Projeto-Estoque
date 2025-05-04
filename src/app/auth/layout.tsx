import React from 'react';
import Image from 'next/image';

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex flex-1">
        <div className="flex flex-col justify-center w-full max-w-md p-8 bg-white shadow-lg">
          <div className="mb-6 flex justify-center">
            <Image
              src="/estoque-logo.png"
              alt="Estoque Logo"
              width={150}
              height={50}
              priority
            />
          </div>
          {children}
        </div>
        <div
          className="hidden lg:flex flex-1 items-center justify-center"
          style={{ backgroundColor: '#458ac9' }}
        >
          <div
            className="bg-cover bg-center rounded-lg shadow-lg h-full w-full"
            style={{ backgroundImage: 'url("/background-estoque.webp")' }}
          />
        </div>
      </div>
    </div>
  );
}
