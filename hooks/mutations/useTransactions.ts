"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Transaction {
  id?: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  date?: string;
  created_at?: string;
}

export function useTransactions(limit = 20) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      const res = await fetch(`/api/transactions?limit=${limit}`, {
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Erro ao carregar transações");
      }
      
      return res.json();
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();

  return useMutation<Transaction, Error, Omit<Transaction, 'id' | 'created_at'>>({
    mutationFn: async (transaction) => {
      const res = await fetch("/api/transactions", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(transaction),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Erro ao criar transação");
      }

      return res.json();
    },
    onSuccess: () => {
      // Invalida todas as queries que começam com 'transactions'
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Erro na mutação:", error);
    },
  });
}

// Hook para deletar transação
export function useDeleteTransaction() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (transactionId) => {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error.message || "Erro ao deletar transação");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
