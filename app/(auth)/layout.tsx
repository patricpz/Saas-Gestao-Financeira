import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '../../app/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Finanças Pessoais',
  description: 'Gerencie suas finanças de forma simples e eficiente',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} bg-gray-50`}>
        {children}
      </body>
    </html>
  );
}
