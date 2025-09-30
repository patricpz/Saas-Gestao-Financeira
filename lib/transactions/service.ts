import { prisma } from '@/lib/prisma'

export type TransactionType = 'INCOME' | 'EXPENSE'

export interface TransactionDTO {
  id: string
  amount: number
  description: string | null
  date: string
  type: TransactionType
  categoryId: string
  userId: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  amount: number
  description?: string | null
  date?: string | Date
  type: TransactionType
  categoryId: string
  userId: string
}

export interface UpdateTransactionInput {
  amount?: number
  description?: string | null
  date?: string | Date
  type?: TransactionType
  categoryId?: string
}

function serialize(transaction: any): TransactionDTO {
  return {
    ...transaction,
    date: transaction.date.toISOString(),
    createdAt: transaction.createdAt.toISOString(),
    updatedAt: transaction.updatedAt.toISOString()
  }
}

export async function listTransactions(userId: string, limit = 10): Promise<TransactionDTO[]> {
  const transactions = await prisma.transaction.findMany({
    where: { userId },
    orderBy: { date: 'desc' },
    take: limit,
    include: { category: true }
  })
  return transactions.map(serialize)
}

export async function getTransactionById(id: string, userId: string): Promise<TransactionDTO | null> {
  const transaction = await prisma.transaction.findUnique({
    where: { id },
    include: { category: true }
  })
  if (!transaction || transaction.userId !== userId) return null
  return serialize(transaction)
}

export async function createTransaction(input: CreateTransactionInput): Promise<TransactionDTO> {
  const transaction = await prisma.transaction.create({
    data: {
      amount: input.amount,
      description: input.description ?? null,
      date: input.date ? new Date(input.date) : new Date(),
      type: input.type,
      categoryId: input.categoryId,
      userId: input.userId
    },
    include: { category: true }
  })
  return serialize(transaction)
}

export async function updateTransaction(id: string, userId: string, input: UpdateTransactionInput): Promise<TransactionDTO | null> {
  const existing = await prisma.transaction.findUnique({ where: { id }, select: { userId: true } })
  if (!existing || existing.userId !== userId) return null

  const transaction = await prisma.transaction.update({
    where: { id },
    data: {
      amount: input.amount,
      description: input.description,
      date: input.date ? new Date(input.date) : undefined,
      type: input.type,
      categoryId: input.categoryId
    },
    include: { category: true }
  })
  return serialize(transaction)
}

export async function deleteTransaction(id: string, userId: string): Promise<boolean> {
  const existing = await prisma.transaction.findUnique({ where: { id }, select: { userId: true } })
  if (!existing || existing.userId !== userId) return false
  await prisma.transaction.delete({ where: { id } })
  return true
}


