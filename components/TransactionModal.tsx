'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useCreateTransaction, useTransactions } from '@/hooks/mutations/useTransactions';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, Plus } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

type TransactionFormData = {
  amount: number;
  description: string;
  date: Date;
  type: 'income' | 'expense';
  categoryId: string;
  category: string;
};

type Category = {
  id: string;
  name: string;
  type: 'income' | 'expense';
};

type TransactionModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { data: transactions = [], isLoading } = useTransactions();
  const createTransaction = useCreateTransaction();

  const { register, handleSubmit, reset, setValue, watch } = useForm<TransactionFormData>({
    defaultValues: {
      type: 'expense',
      date: new Date(),
    },
  });

  // Fetch categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories', {
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return response.json();
    },
  });

  // Filter categories based on selected type
  const transactionType = watch('type');
  const filteredCategories = categories.filter(
    (category) => category.type.toLowerCase() === transactionType.toLowerCase()
  );

  // Log transactions for debugging
  useEffect(() => {
    if (!isLoading) {
      console.log('Transactions loaded:', transactions);
    }
  }, [transactions, isLoading]);

  // Handle form submission
  const onSubmit = async (data: TransactionFormData) => {
    if (!date) return;
    
    try {
      await createTransaction.mutateAsync({
        amount: Number(data.amount),
        description: data.description,
        type: data.type,
        category: data.categoryId,
        date: date.toISOString(),
      });
      
      toast.success('Transação adicionada com sucesso!');
      reset();
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erro ao adicionar transação. Tente novamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Transação</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="type">Tipo</Label>
              <select
                id="type"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                {...register('type', { required: true })}
              >
                <option value="EXPENSE">Despesa</option>
                <option value="INCOME">Receita</option>
              </select>
            </div>
            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', { required: true, min: 0.01 })}
                placeholder="0,00"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              onValueChange={(value) => setValue('categoryId', value)}
              defaultValue=""
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                {filteredCategories.length === 0 && (
                  <div className="p-2 text-sm text-muted-foreground">
                    Nenhuma categoria encontrada
                  </div>
                )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Data</Label>
            <div className="relative">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                locale={ptBR}
                className="rounded-md border"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              {...register('description')}
              placeholder="Adicione uma descrição"
              className="min-h-[100px]"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={createTransaction.isPending}>
              {createTransaction.isPending ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

