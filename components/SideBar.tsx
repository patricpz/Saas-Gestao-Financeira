'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { UserProfile } from "@/types/User";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Icons
import { 
    LayoutDashboard, 
    Landmark, 
    ReceiptText, 
    PieChart, 
    Sparkles, 
    Settings, 
    LogOut, 
    Menu, 
    Wallet,
    MoreHorizontal
} from "lucide-react";

export default function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const { signOut, user } = useAuth() as { signOut: () => Promise<void>, user: UserProfile | null };

    const handleSignOut = async () => {
        try {
            await signOut();
            router.push('/login');
        } catch (error) {
            console.error('Erro ao sair:', error);
        }
    };

    // Definição dos itens do menu conforme sua imagem
    const menuItems = [
        { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
        { href: "/dashboard/accounts", label: "Accounts", icon: Landmark },
        { href: "/dashboard/transactions", label: "Transactions", icon: ReceiptText },
        { href: "/dashboard/budgets", label: "Budgets", icon: PieChart },
        { href: "/dashboard/insights", label: "AI Insights", icon: Sparkles },
        { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ];

    // Componente interno para renderizar a lista de links (reusável no Mobile e Desktop)
    const NavLinks = () => (
        <div className="space-y-1">
            {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all text-sm font-medium
                        ${isActive 
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" 
                            : "text-muted-foreground hover:text-foreground hover:bg-muted"
                        }`}
                    >
                        <item.icon className={`h-4 w-4 ${isActive ? "text-blue-600 dark:text-blue-400" : ""}`} />
                        {item.label}
                    </Link>
                );
            })}
        </div>
    );

    // Componente interno para o Card "Pro Plan"
    const ProPlanCard = () => (
        <div className="mt-auto p-4 bg-blue-50 dark:bg-zinc-900 rounded-xl border border-blue-100 dark:border-zinc-800">
            <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                Pro Plan
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
                Your next AI report is ready.
            </p>
            <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                View Report
            </Button>
        </div>
    );

    // Estrutura do Perfil do Usuário
    const UserProfileSection = () => (
        <div className="border-t pt-4 mt-4">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="w-full justify-start px-2 h-auto hover:bg-muted">
                        <div className="flex items-center gap-2 w-full">
                            <Avatar className="h-8 w-8">
                                <AvatarImage src={user?.user_metadata?.avatar_url} />
                                <AvatarFallback>{user?.email?.charAt(0).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col items-start text-left flex-1 min-w-0">
                                <span className="text-sm font-medium truncate w-full">
                                    {user?.user_metadata?.full_name || 'Usuário'}
                                </span>
                                <span className="text-xs text-muted-foreground truncate w-full">
                                    {user?.email}
                                </span>
                            </div>
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </div>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push('/dashboard/profile')}>
                        Perfil
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => router.push('/dashboard/settings')}>
                        Configurações
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                        <LogOut className="mr-2 h-4 w-4" />
                        Sair
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );

    return (
        <>
            {/* --- SIDEBAR DESKTOP (Visível apenas em telas md+) --- */}
            <aside className="hidden md:flex flex-col w-64 h-screen border-r bg-background sticky top-0 px-4 py-6">
                {/* Logo */}
                <div className="flex items-center gap-2 px-2 mb-8">
                    <div className="bg-blue-600 p-1.5 rounded-lg">
                        <Wallet className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold tracking-tight">FinAI</span>
                </div>

                {/* Navegação Principal */}
                <div className="flex-1 flex flex-col gap-4">
                    <NavLinks />
                </div>

                {/* Área Inferior (Pro Plan + User) */}
                <div className="mt-auto flex flex-col gap-4">
                    <ProPlanCard />
                    <UserProfileSection />
                </div>
            </aside>

            {/* --- HEADER MOBILE (Visível apenas em telas pequenas) --- */}
            <header className="md:hidden flex h-14 items-center gap-4 border-b bg-background px-6 sticky top-0 z-50">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon" className="shrink-0">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Toggle navigation menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col w-72">
                        <div className="flex items-center gap-2 mb-8 px-2">
                            <div className="bg-blue-600 p-1.5 rounded-lg">
                                <Wallet className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xl font-bold">FinAI</span>
                        </div>
                        
                        <NavLinks />
                        
                        <div className="mt-auto flex flex-col gap-4 pb-4">
                            <ProPlanCard />
                            <UserProfileSection />
                        </div>
                    </SheetContent>
                </Sheet>
                <div className="flex items-center gap-2">
                     <span className="font-bold">FinAI</span>
                </div>
            </header>
        </>
    );
}