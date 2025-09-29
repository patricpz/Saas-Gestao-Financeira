'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface TransactionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (transaction: {
    description: string;
    amount: number;
    type: 'despesa' | 'receita';
    category: string;
  }) => void;
}

export default function TransactionModal({ open, onOpenChange, onSave }: TransactionModalProps) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'despesa' | 'receita'>('despesa');
  const [category, setCategory] = useState('');

  const handleSave = () => {
    if (!description || !amount || !category) return;
    onSave({ description, amount, type, category });
    setDescription('');
    setAmount(0);
    setType('despesa');
    setCategory('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Transação</DialogTitle>
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
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="0,00"
            />
          </div>

          {/* Tipo */}
          <div className="grid gap-2">
            <Label>Tipo</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'despesa' ? 'default' : 'outline'}
                onClick={() => setType('despesa')}
                className="flex-1"
              >
                Despesa
              </Button>
              <Button
                type="button"
                variant={type === 'receita' ? 'default' : 'outline'}
                onClick={() => setType('receita')}
                className="flex-1"
              >
                Receita
              </Button>
            </div>
          </div>

          {/* Categoria */}
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alimentacao">Alimentação</SelectItem>
                <SelectItem value="moradia">Moradia</SelectItem>
                <SelectItem value="transporte">Transporte</SelectItem>
                <SelectItem value="lazer">Lazer</SelectItem>
                <SelectItem value="salario">Salário</SelectItem>
                <SelectItem value="outros">Outros</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
