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
  date: string;
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

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<TransactionFormData>({
    defaultValues: {
      type: 'expense',
      date: '',
      amount: 0,
      description: '',
      categoryId: '',
      category: '',
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
  const transactionType = watch('type') as 'income' | 'expense';
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
    if (!date) {
      toast.error('Selecione uma data válida');
      return;
    }
    
    try {
      await createTransaction.mutateAsync({
        amount: Number(data.amount),
        description: data.description,
        type: transactionType, // Usa o tipo já convertido
        category: data.categoryId,
        date: date.toISOString(),
      });
      
      toast.success('Transação adicionada com sucesso!');
      reset({
        type: 'expense',
        amount: 0,
        description: '',
        categoryId: '',
        category: '',
      });
      setDate(new Date());
      onOpenChange(false);
    } catch (error) {
      console.error('Error creating transaction:', error);
      toast.error('Erro ao adicionar transação. Verifique os dados e tente novamente.');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
                {...register('type', { required: 'Tipo é obrigatório' })}
              >
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
              {errors.type && (
                <p className="text-sm text-red-500 mt-1">{errors.type.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="amount">Valor</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                {...register('amount', { 
                  required: 'Valor é obrigatório',
                  min: { value: 0.01, message: 'Valor deve ser maior que zero' }
                })}
                placeholder="0,00"
              />
              {errors.amount && (
                <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="categoryId">Categoria</Label>
            <Select
              onValueChange={(value) => {
                setValue('categoryId', value);
                const selectedCategory = categories.find(cat => cat.id === value);
                if (selectedCategory) {
                  setValue('category', selectedCategory.name);
                }
              }}
              value={watch('categoryId')}
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
                onSelect={(newDate) => {
                  if (newDate) {
                    setDate(newDate);
                    setValue('date', newDate);
                  }
                }}
                locale={ptBR}
                className="rounded-md border w-full"
              />
              {!date && (
                <p className="text-sm text-red-500 mt-1">Selecione uma data</p>
              )}
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
            <Button 
              type="submit" 
              disabled={createTransaction.isPending || !date}
              className="min-w-[100px]"
            >
              {createTransaction.isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Salvando...
                </>
              ) : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

