import type { Metadata } from "next";
import { Roboto, Roboto_Mono } from "next/font/google";
import { App, ConfigProvider } from 'antd'; // Imported App
import "./globals.css";
import theme from '@/config/theme';
import ptBR from 'antd/locale/pt_BR';
import 'dayjs/locale/pt-br';
import { AuthProvider } from '@/contexts/AuthContext'; // Importa o AuthProvider

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

// AVISO: Este é um hack temporário para apresentações.
// NÃO use isso em desenvolvimento normal ou produção.
if (process.env.NODE_ENV === 'development') {
  const originalConsoleWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    if (typeof message === 'string' && (
      message.includes('[antd: compatible] antd v5 support React is 16 ~ 18')
      || message.includes('[antd: compatible] antd v5 support React is 16 ~ 18. see https://u.ant.design/v5-for-19 for compatible.')
    )) {
      // Oculta este aviso específico do Ant Design
      return;
    }
    // Para todos os outros avisos
    originalConsoleWarn.apply(console, args);
  };
}

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
          <App> {/* Added App component wrapper */}
            <AuthProvider>
              {children}
            </AuthProvider>
          </App> {/* Closed App component wrapper */}
        </ConfigProvider>
      </body>
    </html>
  );
}
