'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Download, EditIcon, TrashIcon, ArrowLeft, Loader2 } from 'lucide-react';
import { useMediaQuery } from '@/hooks/MediaQuery';
import Link from 'next/link';
import HeaderBar from '@/components/HeaderBar';
import { TransactionModal } from '@/components/TransactionModal';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { supabase } from '@/lib/supabase';

interface Category {
  id: string;
  name: string;
}

interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  category_id: string | null;
  category: {
    id: string;
    name: string;
  } | null;
}

export default function TransactionsPage() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Define the type for the raw data from Supabase
  interface RawTransaction {
    id: string;
    amount: number;
    description: string | null;
    date: string;
    type: 'INCOME' | 'EXPENSE';
    category_id: string | null;
    categories: Array<{ id: string; name: string }> | null;
  }

  // Fetch transactions
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async (): Promise<Transaction[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select(`
          id,
          amount,
          description,
          date,
          type,
          category_id,
          categories (id, name)
        `)
        .order('date', { ascending: false });
      
      if (error) throw error;
      
      // Transform the data to match our Transaction type
      return (data || []).map((transaction: RawTransaction) => {
        const category = transaction.categories?.[0] || null;
        return {
          id: transaction.id,
          amount: transaction.amount,
          description: transaction.description,
          date: transaction.date,
          type: transaction.type,
          category_id: transaction.category_id,
          category: category ? { id: category.id, name: category.name } : null
        };
      });
    },
  });

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const totalExpenses = transactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const balance = totalIncome - totalExpenses;

  return (
    <div className='min-h-screen flex flex-col'>
      <HeaderBar />
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
              <Button 
                onClick={() => setIsModalOpen(true)}
                className="gap-2 w-full sm:w-auto"
              >
                <Plus className="h-4 w-4" />
                <span>Nova Transação</span>
              </Button>
              <TransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
            </div>
          </div>
        </div>

        {/* Totais */}
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-8">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-600 dark:text-green-400">Receitas</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-300">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalIncome)}
            </p>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">Despesas</p>
            <p className="text-2xl font-bold text-red-700 dark:text-red-300">
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(totalExpenses)}
            </p>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-600 dark:text-blue-400">Saldo</p>
            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-red-700 dark:text-red-300'}`}>
              {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(balance)}
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
                        {/* {transaction.category} */}
                      </span>
                      <span>{new Date(transaction.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end">
                    <p
                      className={`font-medium whitespace-nowrap ${transaction.type === 'INCOME' ? 'text-green-600' : 'text-red-600'}`}
                    >
                      {transaction.type === 'INCOME' ? '+' : '-'}
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
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center p-8">
                <p className="text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</p>
                <Button 
                  onClick={() => setIsModalOpen(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Adicionar primeira transação
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Descrição
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Categoria
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Data
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Valor
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {transactions.map((transaction) => (
                      <tr key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {transaction.description || 'Sem descrição'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {transaction.category ? transaction.category.name : 'Sem categoria'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500 dark:text-gray-300">
                            {format(new Date(transaction.date), 'dd/MM/yyyy', { locale: ptBR })}
                          </div>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap text-right text-sm font-medium ${
                          transaction.type === 'INCOME' 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.type === 'INCOME' ? '+' : '-'} 
                          {new Intl.NumberFormat('pt-BR', { 
                            style: 'currency', 
                            currency: 'BRL' 
                          }).format(transaction.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                            onClick={() => {
                              // TODO: Implement edit functionality
                            }}
                          >
                            <EditIcon className="h-4 w-4" />
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            onClick={() => {
                              // TODO: Implement delete functionality
                            }}
                          >
                            <TrashIcon className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
