import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUp, ArrowDown, Wallet } from 'lucide-react';
import Link from 'next/link';
import HeaderBar from '@/components/HeaderBar';
import TransactionModal from './transactions/new/page';
import CardTranslation from '@/components/CardTranslation';

export default function DashboardPage() {
  const balance = 12500.75;
  const income = 15000.0;
  const expenses = 2499.25;
  const recentTransactions = [
    { id: 1, description: 'Salário', amount: 5000.0, type: 'income', date: '2023-05-15' },
    { id: 2, description: 'Mercado', amount: 350.5, type: 'expense', date: '2023-05-14' },
    { id: 3, description: 'Aluguel', amount: 1200.0, type: 'expense', date: '2023-05-10' },
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <HeaderBar />
        <div className="flex justify-between">
          <h1 className="text-2xl sm:text-3xl font-bold">Dashboard</h1>
          <TransactionModal />
        </div>
      </div>

      {/* Balance Cards */}
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

      {/* Recent Transactions */}
      <CardTranslation />
    </div>
  );
}
