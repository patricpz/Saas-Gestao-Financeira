'use client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { useAuth } from "../useAuth";

// Configuração base do axios
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

type TransactionType = 'INCOME' | 'EXPENSE';

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  type: TransactionType;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export function useTransactions(limit = 20) {
  const { accessToken, isAuthenticated } = useAuth();

  return useQuery<Transaction[]>({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      if (!isAuthenticated || !accessToken) {
        throw new Error('Authentication required');
      }
      
      const { data } = await api.get<Transaction[]>('/transactions', {
        params: { limit },
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      
      return data.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0],
      }));
    },
    enabled: isAuthenticated && !!accessToken,
  });
}

interface CreateTransactionInput {
  amount: number;
  description: string;
  type: TransactionType;
  category: string;
  date: string;
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAuth();

  return useMutation<Transaction, AxiosError, CreateTransactionInput>({
    mutationFn: async (transaction) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error('Authentication required');
      }
      
      const { data } = await api.post<Transaction>('/transactions', transaction, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
      return data;
    },
    onSuccess: () => {
      // Invalida todas as queries que começam com 'transactions'
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error: AxiosError) => {
      console.error("Erro ao criar transação:", error.response?.data || error.message);
      throw error;
    },
  });
}

// Hook para deletar transação
export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  const { accessToken, isAuthenticated } = useAuth();

  return useMutation<void, AxiosError, string>({
    mutationFn: async (transactionId) => {
      if (!isAuthenticated || !accessToken) {
        throw new Error('Authentication required');
      }
      
      await api.delete(`/transactions/${transactionId}`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
    onError: (error) => {
      console.error("Erro ao deletar transação:", error.response?.data || error.message);
      throw error;
    },
  });
}
