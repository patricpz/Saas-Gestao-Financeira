'use client';

import React, { useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  CalendarDays,
  Download,
  Loader2,
  MoreHorizontal,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Sparkles,
  Tags,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import TransactionModal from '@/components/TransactionModal';
import { useTransactions, useDeleteTransaction, useUpdateTransaction } from '@/hooks/mutations/useTransactions';
import Sidebar from '@/components/SideBar';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';

export default function TransactionsPage() {
  const formatCurrency = useCurrencyFormatter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<'7' | '30' | '90' | 'all'>('30');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 10;
  const queryClient = useQueryClient();

  const { data: transactions = [], isLoading } = useTransactions(200);

  const deleteMutation = useDeleteTransaction();
  const updateMutation = useUpdateTransaction();

  const handleEdit = (t: any) => {
    const newDescription = prompt('Descrição', t.description ?? '');
    if (newDescription === null) return;
    const currentAbs = Math.abs(t.amount);
    const amountStr = prompt('Valor (use ponto para decimais)', String(currentAbs));
    if (amountStr === null) return;
    const parsed = Number(amountStr);
    if (Number.isNaN(parsed) || parsed <= 0) {
      toast.error('Valor inválido');
      return;
    }

    updateMutation.mutate(
      {
        id: t.id,
        data: {
          description: newDescription,
          amount: Math.abs(parsed),
        },
      },
      {
        onSuccess: () => toast.success('Transação atualizada com sucesso'),
        onError: () => toast.error('Erro ao atualizar transação'),
      }
    );
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta transação?')) {
      deleteMutation.mutate(id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['transactions'] });
          toast.success('Transação excluída com sucesso');
        },
        onError: () => {
          toast.error('Erro ao excluir transação');
        },
      });
    }
  };

  const categoryOptions = useMemo(() => {
    const categories = new Set(
      transactions
        .map((transaction) => transaction.category?.name)
        .filter((category): category is string => Boolean(category))
    );
    return Array.from(categories).sort((a, b) => a.localeCompare(b));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    const now = new Date();

    return transactions
      .filter((transaction) => {
        if (dateRange === 'all') return true;

        const transactionDate = new Date(transaction.date);
        const diffMs = now.getTime() - transactionDate.getTime();
        const diffDays = diffMs / (1000 * 60 * 60 * 24);
        return diffDays <= Number(dateRange);
      })
      .filter((transaction) => {
        if (categoryFilter === 'all') return true;
        return transaction.category?.name === categoryFilter;
      })
      .filter((transaction) => {
        const text = `${transaction.description ?? ''} ${transaction.category?.name ?? ''}`.toLowerCase();
        return text.includes(search.trim().toLowerCase());
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, dateRange, categoryFilter, search]);

  const totalIncome = filteredTransactions
    .filter((transaction) => transaction.type === 'INCOME')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const totalExpenses = filteredTransactions
    .filter((transaction) => transaction.type === 'EXPENSE')
    .reduce((sum, transaction) => sum + Math.abs(transaction.amount), 0);

  const netChange = totalIncome - totalExpenses;

  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedTransactions = filteredTransactions.slice((safePage - 1) * pageSize, safePage * pageSize);

  const visibleFrom = filteredTransactions.length === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const visibleTo = Math.min(safePage * pageSize, filteredTransactions.length);

  const dateRangeLabel =
    dateRange === 'all'
      ? 'Todo período'
      : dateRange === '7'
      ? 'Últimos 7 dias'
      : dateRange === '30'
      ? 'Últimos 30 dias'
      : 'Últimos 90 dias';

  const categoryColor = (name?: string | null) => {
    if (!name) return 'bg-slate-100 text-slate-700';

    const key = name.toLowerCase();
    if (key.includes('food') || key.includes('mercado')) return 'bg-green-100 text-green-700';
    if (key.includes('income') || key.includes('salário') || key.includes('salary')) return 'bg-blue-100 text-blue-700';
    if (key.includes('transport')) return 'bg-amber-100 text-amber-700';
    if (key.includes('health') || key.includes('saúde')) return 'bg-pink-100 text-pink-700';
    if (key.includes('tech') || key.includes('software')) return 'bg-purple-100 text-purple-700';
    return 'bg-slate-100 text-slate-700';
  };

  const handleFilterReset = () => {
    setSearch('');
    setDateRange('30');
    setCategoryFilter('all');
    setCurrentPage(1);
  };


  return (
    <div className='min-h-screen bg-slate-100 md:flex'>
      <Sidebar />
      <main className="flex-1 px-4 py-4 md:px-6 md:py-5 lg:px-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-slate-900">Transactions</h1>
          <Button onClick={() => setIsModalOpen(true)} className="gap-2 bg-blue-600 text-white hover:bg-blue-700">
            <Plus className="h-4 w-4" />
            New Transaction
          </Button>
          <TransactionModal open={isModalOpen} onOpenChange={setIsModalOpen} />
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Total transactions
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className="text-4xl font-bold text-slate-900">{filteredTransactions.length}</p>
              <p className="text-sm text-slate-500">{dateRangeLabel}</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-slate-200 bg-white shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                Net change
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <p className={`text-4xl font-bold ${netChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {netChange >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netChange))}
              </p>
              <p className="text-sm text-slate-500">{dateRangeLabel}</p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                className="h-10 border-slate-200 bg-slate-50 pl-9"
                placeholder="Search by description or category..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Select
                value={dateRange}
                onValueChange={(value: '7' | '30' | '90' | 'all') => {
                  setDateRange(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-[180px] border-slate-200 bg-white">
                  <CalendarDays className="h-4 w-4 text-slate-500" />
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                  <SelectItem value="90">Last 90 days</SelectItem>
                  <SelectItem value="all">All time</SelectItem>
                </SelectContent>
              </Select>

              <Select
                value={categoryFilter}
                onValueChange={(value) => {
                  setCategoryFilter(value);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-[190px] border-slate-200 bg-white">
                  <Tags className="h-4 w-4 text-slate-500" />
                  <SelectValue placeholder="All categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button variant="outline" className="h-10 gap-2 border-slate-200" onClick={handleFilterReset}>
                <SlidersHorizontal className="h-4 w-4" />
                Filter
              </Button>

              <Button
                variant="outline"
                className="h-10 gap-2 border-slate-200"
                onClick={() => toast.info('Exportação em breve')}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {isLoading ? (
            <div className="flex h-48 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center gap-3 px-4 text-center">
              <p className="text-sm text-slate-500">Nenhuma transação encontrada para os filtros selecionados.</p>
              <Button onClick={handleFilterReset} variant="outline" className="border-slate-200">
                Limpar filtros
              </Button>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                      <th className="px-4 py-3">Date</th>
                      <th className="px-4 py-3">Description</th>
                      <th className="px-4 py-3">Category</th>
                      <th className="px-4 py-3">Account</th>
                      <th className="px-4 py-3 text-right">Amount</th>
                      <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedTransactions.map((transaction) => {
                      const amount = Math.abs(transaction.amount);
                      const isIncome = transaction.type === 'INCOME';

                      return (
                        <tr key={transaction.id} className="border-b border-slate-100 text-sm text-slate-700">
                          <td className="px-4 py-3 text-slate-500">{new Date(transaction.date).toLocaleDateString('pt-BR')}</td>
                          <td className="px-4 py-3">
                            <p className="font-semibold text-slate-900">{transaction.description || 'Transação sem descrição'}</p>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${categoryColor(
                                transaction.category?.name
                              )}`}
                            >
                              {transaction.category?.name || 'Sem categoria'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-slate-500">Conta principal</td>
                          <td className={`px-4 py-3 text-right font-semibold ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
                            {isIncome ? '+' : '-'}{formatCurrency(amount)}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-blue-600"
                                onClick={() => handleEdit(transaction)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-slate-500 hover:text-red-600"
                                onClick={() => handleDelete(transaction.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-col gap-3 border-t border-slate-100 px-4 py-3 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
                <p>
                  Showing {visibleFrom} to {visibleTo} of {filteredTransactions.length} results
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                  >
                    Previous
                  </Button>
                  <span className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700">
                    {safePage} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-slate-200"
                    disabled={safePage >= totalPages}
                    onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-blue-600 p-2 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-900">AI Assistant: Spending anomalies</p>
                <p className="text-xs text-slate-600">
                  I noticed recurring subscriptions that increased in price this month. Would you like to review them?
                </p>
              </div>
            </div>
            <Button variant="ghost" className="text-sm font-semibold text-blue-600 hover:bg-blue-100 hover:text-blue-700">
              Review now
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
