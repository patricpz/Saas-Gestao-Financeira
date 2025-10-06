'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateTransaction } from '@/hooks/mutations/useTransactions';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useCurrencyFormatter } from '@/hooks/useCurrencyFormatter';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface Category {
  id: string;
  name: string;
  type: 'INCOME' | 'EXPENSE';
}

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionModal({ open, onOpenChange }: TransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<string>('');
  const [type, setType] = useState<'EXPENSE' | 'INCOME'>('EXPENSE');
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const formatCurrency = useCurrencyFormatter();

  // --- helpers para formatar/parsing ---
  const formatToCurrency = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (!onlyNums) return '';
    const number = Number(onlyNums) / 100;
    return formatCurrency(number);
  };

  const parseCurrency = (value: string) => {
    const onlyNums = value.replace(/\D/g, '');
    if (!onlyNums) return 0;
    return Number(onlyNums) / 100;
  };

  // Buscar categorias
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    },
  });

  // Hook para criar transação
  const createTransaction = useCreateTransaction();

  // Filtrar categorias por tipo
  const filteredCategories = categories.filter(cat => cat.type === type);

  const handleSave = async () => {
    if (!description || !amount || !categoryId) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    const numericAmount = parseCurrency(amount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    try {
      await createTransaction.mutateAsync({
        description,
        amount: type === 'EXPENSE' ? Math.abs(numericAmount) : Math.abs(numericAmount),
        type,
        categoryId,
        date,
      });

      toast.success('Transação criada com sucesso!');
      resetForm();
      onOpenChange(false);
    } catch (error) {
      toast.error('Erro ao criar transação');
      console.error('Error creating transaction:', error);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setType('EXPENSE');
    setCategoryId('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  // Reset form quando abrir modal
  useEffect(() => {
    if (open) resetForm();
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{type === 'EXPENSE' ? 'Nova Despesa' : 'Nova Receita'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        {/* Descrição */}
        <div className="grid gap-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Conta de luz"
          />
        </div>

        {/* Valor */}
        <div className="grid gap-2">
            <Label htmlFor="amount">Valor</Label>
            <Input
              id="amount"
              type="text"
              value={amount}
              onChange={(e) => {
                const input = e.target.value;
                if (!input) {
                  setAmount('');
                  return;
                }
                setAmount(formatToCurrency(input));
              }}
              onBlur={() => {
                if (amount) {
                  const value = parseCurrency(amount);
                  setAmount(formatCurrency(value));
                }
              }}
              placeholder="R$ 0,00"
            />
          </div>

          {/* Data */}
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Tipo */}
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'EXPENSE' ? 'default' : 'outline'}
                onClick={() => {
                  setType('EXPENSE');
                  setCategoryId('');
                }}
                className="flex-1"
              >
                Despesa
              </Button>
              <Button
                type="button"
                variant={type === 'INCOME' ? 'default' : 'outline'}
                onClick={() => {
                  setType('INCOME');
                  setCategoryId('');
                }}
                className="flex-1"
              >
                Receita
              </Button>
            </div>
          </div>

          {/* Categoria */}
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={categoryId} onValueChange={setCategoryId}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {filteredCategories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={createTransaction.isPending}
          >
            {createTransaction.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
