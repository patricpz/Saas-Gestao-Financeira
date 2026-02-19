'use client';

import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown, Wallet, Search, Bell, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import CardTranslation from '@/components/CardTranslation';
import { useTransactions } from '@/hooks/mutations/useTransactions';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { BalanceCard } from '@/components/BalanceCard';
import TransactionModal from '@/components/TransactionModal';
import Sidebar from '@/components/SideBar';
import { Input } from '@/components/ui/input';
import type { Transaction as TransactionType } from '@/lib/types/domain';



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
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />
      <main className="flex-1 px-4 py-4 md:px-6 md:py-5 lg:px-7">
        <TransactionModal 
          open={isModalOpen} 
          onOpenChange={setIsModalOpen} 
        />

        <div className="hidden md:flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="relative w-full max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              className="h-10 border-slate-200 bg-slate-50 pl-10 text-sm"
              placeholder="Buscar transações, insights..."
            />
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="rounded-full p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              aria-label="Notificações"
            >
              <Bell className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-3">
              <div className="text-right leading-tight">
                <p className="text-sm font-semibold text-slate-800">Painel Financeiro</p>
                <p className="text-xs text-slate-500">Premium Member</p>
              </div>
              <div className="h-9 w-9 rounded-full bg-slate-900" />
            </div>
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 p-4 text-white shadow-lg shadow-blue-500/20 md:p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-white/20 p-2">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <p className="text-lg font-semibold">Smart Saving Opportunity</p>
                <p className="text-sm text-blue-100">
                  Você gastou 15% menos com lazer este mês. Mantendo o ritmo, alcança sua meta antes do previsto.
                </p>
              </div>
            </div>

            <Button className="bg-white text-blue-700 hover:bg-blue-50">Apply Strategy</Button>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            Nova Transação
          </Button>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <BalanceCard 
            title="Saldo Total" 
            value={formatCurrency(balance)} 
            icon={<Wallet className="h-4 w-4" />} 
            color="text-blue-600"
            trend={balance >= 0 ? '↗ +2.4%' : '↘ -2.4%'}
            trendClassName={balance >= 0 ? 'text-green-600' : 'text-red-500'}
            className="border-slate-200 bg-white"
          />
          <BalanceCard
            title="Receitas"
            value={formatCurrency(income)}
            icon={<ArrowUp className="h-4 w-4" />}
            color="text-blue-600"
            subtitle="Próxima entrada prevista em 7 dias"
            className="border-slate-200 bg-white"
          />
          <BalanceCard
            title="Despesas"
            value={formatCurrency(expenses)}
            icon={<ArrowDown className="h-4 w-4" />}
            color="text-blue-600"
            trend="↗ +$1,120.00"
            trendClassName="text-blue-600"
            className="border-slate-200 bg-white"
          />
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[2fr_1fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Income vs. Expenses</CardTitle>
              <p className="text-sm text-slate-500">Acompanhamento da lucratividade no ano atual</p>
            </CardHeader>
            <CardContent>
              <div className="grid h-64 grid-cols-6 items-end gap-5 rounded-xl border border-slate-100 bg-slate-50 p-5">
                {[42, 56, 68, 48, 82, 64].map((value, index) => (
                  <div key={index} className="flex h-full flex-col justify-end gap-2">
                    <div className="w-full rounded-md bg-blue-100" style={{ height: `${Math.min(100, value + 20)}%` }} />
                    <div className="w-full rounded-md bg-blue-600" style={{ height: `${value}%` }} />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-5 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />Income
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-200" />Expenses
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Category Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mx-auto mb-6 flex h-44 w-44 items-center justify-center rounded-full bg-[conic-gradient(#1d4ed8_0_20%,#3b82f6_20%_50%,#93c5fd_50%_75%,#dbeafe_75%_100%)]">
                <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full bg-white text-center">
                  <span className="text-3xl font-bold text-slate-900">{formatCurrency(expenses)}</span>
                  <span className="text-xs text-slate-500">Total gasto</span>
                </div>
              </div>

              <div className="space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-700" />Housing</span>
                  <span className="font-semibold text-slate-900">$2,100</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-400" />Entertainment</span>
                  <span className="font-semibold text-slate-900">$840</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full bg-blue-100" />Others</span>
                  <span className="font-semibold text-slate-900">$2,460</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <CardTranslation transactions={recentTransactions} formatCurrency={formatCurrency} />
        </div>
      </main>
    </div>
  );
}
