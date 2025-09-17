'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/navigation';
import { Home, Wallet, BarChart2, Settings, LogIn, UserPlus } from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith('/auth');

  if (isAuthPage) return null;

  return (
    <nav className="border-b bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Wallet className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Finanças Pessoais</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login" className="flex items-center space-x-2">
                <LogIn className="h-4 w-4" />
                <span>Entrar</span>
              </Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register" className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4" />
                <span>Criar conta</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
