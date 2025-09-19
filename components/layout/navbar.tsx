'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Wallet, BarChart2, Settings, LogIn, UserPlus, User, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';


export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = pathname.startsWith('/auth');
  const isLoggedIn = true; // Replace with actual auth state
  const user = { name: 'Usuário', email: 'usuario@exemplo.com' }; // Replace with actual user data

  if (isAuthPage) return null;

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logout');
  };

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
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="" alt={user.name} />
                      <AvatarFallback>
                        {user.name
                          .split(' ')
                          .map((n: string) => n[0])
                          .join('')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard/profile" className="w-full cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      <span>Perfil</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
