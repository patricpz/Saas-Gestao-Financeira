import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/layout/navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Dashboard | Finanças Pessoais',
  description: 'Gerencie suas finanças de forma simples e eficiente',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-gray-50`}>
        <main className="min-h-[calc(100vh-4rem)]">
          {children}
        </main>
      </body>
    </html>
  );
}
