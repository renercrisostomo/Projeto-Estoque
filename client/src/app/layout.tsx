import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { ConfigProvider } from 'antd';
import "./globals.css";
import theme from '@/config/theme';
import ptBR from 'antd/locale/pt_BR';
import 'dayjs/locale/pt-br';
import { AuthProvider } from '@/contexts/AuthContext';
import "@ant-design/v5-patch-for-react-19";

const robotoSans = Roboto({
  variable: "--font-roboto-sans",
  subsets: ["latin"],
});

const robotoMono = Roboto_Mono({
  variable: "--font-roboto-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Gestor de Estoque",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  description: "Gestor de Estoque. Trabalho de APS",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-br">
      <body
        className={`${robotoSans.variable} ${robotoMono.variable} antialiased`}
      >
        <ConfigProvider locale={ptBR} theme={theme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ConfigProvider>
      </body>
    </html>
  );
}
