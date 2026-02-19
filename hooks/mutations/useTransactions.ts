'use client';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { transactionsService } from "@/lib/services/transactions";
import type { CreateTransactionInput, Transaction, UpdateTransactionInput } from "@/lib/types/domain";

export function useTransactions(limit = 20) {
  return useQuery<Transaction[]>({
    queryKey: ["transactions", limit],
    queryFn: async () => {
      const data = await transactionsService.list(limit);
      return data.map(transaction => ({
        ...transaction,
        date: new Date(transaction.date).toISOString().split('T')[0],
      }));
    },
  });
}

export function useCreateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<Transaction, AxiosError, CreateTransactionInput>({
    mutationFn: async (transaction) => {
      const data = await transactionsService.create(transaction);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useDeleteTransaction() {
  const queryClient = useQueryClient();
  return useMutation<void, AxiosError, string>({
    mutationFn: async (transactionId) => {
      await transactionsService.remove(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}

export function useUpdateTransaction() {
  const queryClient = useQueryClient();
  return useMutation<Transaction, AxiosError, { id: string; data: UpdateTransactionInput }>({
    mutationFn: async ({ id, data }) => {
      const updated = await transactionsService.update(id, data);
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
