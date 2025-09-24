'use client';

import { useState, useEffect } from 'react';
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

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [recentTransactions, setRecentTransactions] = useState<TransactionType[]>([]);
  const router = useRouter();
  
  // Use the useAuth hook to check authentication status
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const { data: transactionsData, isLoading, error } = useTransactions();

  // Update state when transactions data is loaded
  useEffect(() => {
    if (transactionsData) {
      // Calculate balance, income, and expenses from transactions
      const transactions = transactionsData as TransactionType[];
      
      const calculatedIncome = transactions
        .filter((t) => t.type === 'INCOME')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      const calculatedExpenses = transactions
        .filter((t) => t.type === 'EXPENSE')
        .reduce((sum, t) => sum + Number(t.amount), 0);
      
      setIncome(calculatedIncome);
      setExpenses(calculatedExpenses);
      setBalance(calculatedIncome - calculatedExpenses);
      
      // Get recent transactions (last 5)
      const sortedTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);
      
      setRecentTransactions(sortedTransactions);
    }
  }, [transactionsData]);

  return (

    <div className='min-h-screen flex flex-col'>
      <HeaderBar />
      <div className="container mx-auto px-4 py-6">

        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          {/* Título */}
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>

          {/* Ações */}
          <div className="flex gap-2">
            <Button onClick={() => setIsModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Nova Transação</span>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/reports">
                Relatório
              </Link>
            </Button>
          </div>
          
          <TransactionModal 
            open={isModalOpen} 
            onOpenChange={setIsModalOpen} 
          />
        </div>


        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold">
                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Receitas</CardTitle>
              <ArrowUp className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-green-500">
                +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(income)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Despesas</CardTitle>
              <ArrowDown className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-xl sm:text-2xl font-bold text-red-500">
                -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(expenses)}
              </div>
            </CardContent>
          </Card>
        </div>

        <CardTranslation />
      </div>
    </div>
  );
}
