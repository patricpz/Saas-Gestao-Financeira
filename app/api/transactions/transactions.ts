import { prisma } from '@/lib/prisma';

export interface Transaction {
  id: string;
  amount: number;
  description: string | null;
  date: string;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  userId: string;
  category: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

export const getTransactions = async (userId: string) => {
  const transactions = await prisma.transaction.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      date: 'desc',
    },
  });

  return transactions.map((transaction) => ({
    ...transaction,
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  }));
};

export const createTransaction = async (data: {
  amount: number;
  description?: string | null;
  date?: string | Date;
  type: 'INCOME' | 'EXPENSE';
  categoryId: string;
  userId: string;
}) => {
  const transaction = await prisma.transaction.create({
    data: {
      amount: data.amount,
      description: data.description,
      date: data.date ? new Date(data.date) : new Date(),
      type: data.type,
      categoryId: data.categoryId,
      userId: data.userId,
    },
    include: {
      category: true,
    },
  });

  return {
    ...transaction,
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString(),
  };
};

export const deleteTransaction = async (id: string, userId: string) => {
  // Verifica se a transação pertence ao usuário
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    select: { userId: true },
  });

  if (!transaction || transaction.userId !== userId) {
    throw new Error('Transaction not found or access denied');
  }

  await prisma.transaction.delete({
    where: { id },
  });
};
