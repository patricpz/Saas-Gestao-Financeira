'use client';

import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, EditIcon, TrashIcon, ArrowLeft } from 'lucide-react';
import TransactionModal from './new/page';
import { useMediaQuery } from '@/hooks/MediaQuery';
import Link from 'next/link';

export default function TransactionsPage() {
  // Mock data
  const transactions = [
    { id: 1, description: 'Salário', amount: 5000.0, type: 'income', category: 'Salário', date: '2023-05-15' },
    { id: 2, description: 'Mercado', amount: 350.5, type: 'expense', category: 'Alimentação', date: '2023-05-14' },
    { id: 3, description: 'Aluguel', amount: 1200.0, type: 'expense', category: 'Moradia', date: '2023-05-10' },
    { id: 4, description: 'Internet', amount: 120.0, type: 'expense', category: 'Contas', date: '2023-05-08' },
    { id: 5, description: 'Freelance', amount: 2500.0, type: 'income', category: 'Trabalho', date: '2023-05-05' },
  ];

  const totalIncome = transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col space-y-4 mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/dashboard">
              <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">Transações</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="flex-1 flex flex-wrap gap-2">
            <Button variant="outline" className="gap-2 flex-1 min-w-[120px]">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
            <Button variant="outline" className="gap-2 flex-1 min-w-[120px]">
              <Filter className="h-4 w-4" />
              <span className="hidden sm:inline">Filtrar</span>
            </Button>
          </div>
          <div className="w-full sm:w-auto">
            <TransactionModal />
          </div>
        </div>
      </div>

      {/* Totais */}
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Total de Transações</p>
          <p className="text-2xl font-bold">{transactions.length}</p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Total de Receitas</p>
          <p className="text-2xl font-bold text-green-500">
            +{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
          </p>
        </div>
        <div className="p-4 border rounded-lg bg-card">
          <p className="text-sm text-muted-foreground">Total de Despesas</p>
          <p className="text-2xl font-bold text-red-500">
            -{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpenses)}
          </p>
        </div>
      </div>

      {/* Lista */}
      {isMobile ? (
        // Cards no mobile
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div key={transaction.id} className="p-4 border rounded-lg bg-card shadow-sm hover:shadow transition-shadow">
              <div className="flex justify-between items-start gap-2">
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{transaction.description}</p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-muted-foreground">
                    <span className="inline-flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full mr-1 bg-muted-foreground"></span>
                      {transaction.category}
                    </span>
                    <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p
                    className={`font-medium whitespace-nowrap ${
                      transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                  </p>
                  <div className="flex gap-1 mt-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600">
                      <EditIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600">
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        // Tabela no desktop
        <div className="bg-card rounded-lg border overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Data</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Descrição</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Categoria</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Valor</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-muted-foreground">
                      {new Date(transaction.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-foreground">
                      <div className="max-w-[200px] truncate" title={transaction.description}>
                        {transaction.description}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                        {transaction.category}
                      </span>
                    </td>
                    <td
                      className={`px-4 py-3 whitespace-nowrap text-sm font-medium text-right ${
                        transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}
                      {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div className="flex justify-end space-x-1">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-blue-600">
                          <EditIcon className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-muted-foreground hover:text-red-600">
                          <TrashIcon className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
