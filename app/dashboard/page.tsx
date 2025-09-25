'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import HeaderBar from '@/components/HeaderBar';
import CardTranslation from '@/components/CardTranslation';
import { useTransactions, type Transaction as TransactionType } from '@/hooks/mutations/useTransactions';
import { TransactionModal } from '@/components/TransactionModal';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { BalanceCard } from '@/components/BalanceCard';



export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const formatCurrency = useCurrencyFormatter();


  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const { data: transactionsData } = useTransactions();

  // 🔹 Redirecionar se não autenticado
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  // 🔹 Cálculos derivados das transações
  const { balance, income, expenses, recentTransactions } = useMemo(() => {
    if (!transactionsData) {
      return { 
        balance: 0, 
        income: 0, 
        expenses: 0, 
        recentTransactions: [] as TransactionType[] 
      };
    }

    const transactions = Array.isArray(transactionsData) ? transactionsData : [transactionsData];

    const income = transactions
      .filter((t) => t.type === 'INCOME')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const expenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + (Number(t.amount) || 0), 0);

    const balance = income - expenses;

    const recentTransactions = [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);

    return { 
      balance, 
      income, 
      expenses, 
      recentTransactions 
    };
  }, [transactionsData]);

  return (
    <div className="min-h-screen flex flex-col">
      <HeaderBar />
      <div className="container mx-auto px-4 py-6">
        
        {/* Header e ações */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Transação</span>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/reports">Relatório</Link>
            </Button>
          </div>

          <TransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>

        {/* Cards de saldo */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <BalanceCard 
            title="Saldo Total" 
            value={formatCurrency(balance)} 
            icon={<Wallet className="h-4 w-4" />} 
            color={balance >= 0 ? 'text-green-500' : 'text-red-500'}
          />
          <BalanceCard
            title="Receitas"
            value={`+${formatCurrency(income)}`}
            icon={<ArrowUp className="h-4 w-4" />}
            color="text-green-500"
          />
          <BalanceCard
            title="Despesas"
            value={`-${formatCurrency(expenses)}`}
            icon={<ArrowDown className="h-4 w-4" />}
            color="text-red-500"
          />
        </div>

        {/* Outras seções */}
        <CardTranslation />
      </div>
    </div>
  );
}
