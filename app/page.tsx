'use client';

import { Button } from '@/components/ui/button';
import { Home as HomeIcon, LogIn, UserPlus, List, PlusCircle, BarChart } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const navigation = [
    { 
      title: 'Login', 
      href: '/login',
      description: 'Acesse sua conta para gerenciar suas finanças',
      icon: <LogIn className="w-6 h-6" />,
      variant: 'outline' as const
    },
    { 
      title: 'Cadastro', 
      href: '/register',
      description: 'Crie uma nova conta para começar a usar o sistema',
      icon: <UserPlus className="w-6 h-6" />,
      variant: 'outline' as const
    },
    { 
      title: 'Dashboard', 
      href: '/dashboard',
      description: 'Visão geral das suas finanças e métricas importantes',
      icon: <BarChart className="w-6 h-6" />,
      variant: 'default' as const
    },
    { 
      title: 'Transações', 
      href: '/transactions',
      description: 'Visualize e gerencie todas as suas transações',
      icon: <List className="w-6 h-6" />,
      variant: 'default' as const
    },
    { 
      title: 'Nova Transação', 
      href: '/transactions/new',
      description: 'Adicione uma nova transação de entrada ou saída',
      icon: <PlusCircle className="w-6 h-6" />,
      variant: 'default' as const
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <HomeIcon className="mx-auto h-12 w-12 text-primary" />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Finanças Pessoais
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Gerencie suas finanças de forma simples e eficiente
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {navigation.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className="group block"
            >
              <div className="h-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-lg ${
                    item.variant === 'default' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.icon}
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {item.title}
                  </h2>
                </div>
                <p className="mt-3 text-gray-600">
                  {item.description}
                </p>
                <div className="mt-4">
                  <Button variant={item.variant} className="w-full">
                    Acessar
                  </Button>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-12 text-center">
          <h2 className="text-lg font-medium text-gray-900">
            Comece agora mesmo
          </h2>
          <p className="mt-2 text-gray-600">
            Escolha uma das opções acima para começar a gerenciar suas finanças
          </p>
        </div>
      </main>
    </div>
  );
}
