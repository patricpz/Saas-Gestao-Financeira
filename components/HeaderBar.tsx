'use client';

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserIcon, SettingsIcon, LogOutIcon, ChevronDownIcon, Shield, Menu, X, DollarSign } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/User";

export default function HeaderBar() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const {  signOut } = useAuth();
      const { user } = useAuth()  as { user: UserProfile | null };
    
    const router = useRouter();

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Erro ao sair:', error);
        }
    };


 
    return (
        <header className="w-screen bg-white dark:bg-zinc-900 shadow-md">
            <div className="max-w-[1400px] mx-auto w-full px-4 py-3 sm:px-6 sm:py-4">
                <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center">
                    <DollarSign className="h-10 w-10 sm:h-12 sm:w-12" />
                        {/* <Image
                            src={DollarSign}
                            alt="Logo"
                            width={40}
                            height={40}
                            className="h-10 w-10 sm:h-12 sm:w-12"
                            priority
                        /> */}
                    </Link>
                </div>

                <nav className="hidden sm:flex gap-4 md:gap-6 items-center">
                    <Link href="/dashboard" className="hover:underline">Dashboard</Link>
                    <Link href="/dashboard/transactions" className="hover:underline">Lançamentos</Link>


                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-8 w-auto justify-start rounded-full p-0">
                                {user ? (
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8 mr-2">
                                            <AvatarImage src={user.user_metadata?.avatar_url} alt={user.email || 'Usuário'} />
                                            <AvatarFallback>
                                                {user.email?.charAt(0).toUpperCase() || 'U'}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm font-medium">
                                            {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Usuário'}
                                        </span>
                                        <ChevronDownIcon className="ml-1 h-4 w-4" />
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <Button asChild variant="outline" size="sm">
                                            <Link href="/login">Entrar</Link>
                                        </Button>
                                        <Button asChild size="sm">
                                            <Link href="/register">Criar conta</Link>
                                        </Button>
                                    </div>
                                )}
                            </Button>
                        </DropdownMenuTrigger>
                        {user && (
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {user.user_metadata?.full_name || 'Usuário'}
                                        </p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user.email}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/profile">
                                        <UserIcon className="mr-2 h-4 w-4" />
                                        <span>Perfil</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href="/dashboard/settings">
                                        <SettingsIcon className="mr-2 h-4 w-4" />
                                        <span>Configurações</span>
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer">
                                    <LogOutIcon className="mr-2 h-4 w-4" />
                                    <span>Sair</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        )}
                    </DropdownMenu>
                </nav>

                {/* Mobile menu button */}
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="sm:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                    aria-label="Toggle menu"
                >
                    {isMobileMenuOpen ? (
                        <X className="h-6 w-6" />
                    ) : (
                        <Menu className="h-6 w-6" />
                    )}
                </button>
            </div>

            {/* Mobile menu */}
            <div
                className={`${isMobileMenuOpen ? 'max-h-[70vh] py-4 opacity-100' : 'max-h-0 py-0 opacity-0'
                    } sm:hidden overflow-hidden transition-all duration-300 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-gray-700`}>
                <div className="px-4">
                    <div className="pt-2 space-y-2">
                        <Link
                            href="/dashboard"
                            className="block px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/dashboard/transactions"
                            className="block px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Lançamentos
                        </Link>

                        <div className="border-t border-gray-200 dark:border-gray-700 my-3" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback className="text-sm">PA</AvatarFallback>
                                </Avatar>
                                <div className="min-w-0 flex-1">
                                    <p className="text-sm font-medium truncate">Patric</p>
                                    <p className="text-xs text-muted-foreground truncate">email@email.com</p>
                                    {/* {userRole && (
                                        <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                                            {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                                        </span>
                                    )} */}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Link
                                    href="/dashboard/profile"
                                    className="flex items-center px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <UserIcon className="mr-3 h-5 w-5" />
                                    <span>Meu Perfil</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center px-3 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <SettingsIcon className="mr-3 h-5 w-5" />
                                    <span>Configurações</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                    }}
                                    className="w-full flex items-center px-3 py-3 text-left text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                >
                                    <LogOutIcon className="mr-3 h-5 w-5" />
                                    <span>Sair</span>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                </div>
            </div>
        </header>
    );
} 