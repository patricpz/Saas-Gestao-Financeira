import { Transaction, CreateTransactionInput, UpdateTransactionInput } from '@/lib/types/domain'
import { categoriesMock } from './categories'

const mockUserId = 'mock-user-1'

let transactions: Transaction[] = [
  {
    id: 'tx-1',
    amount: 250.0,
    description: 'Supermercado',
    date: new Date().toISOString().split('T')[0],
    type: 'EXPENSE',
    categoryId: 'cat-1',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: mockUserId,
  },
  {
    id: 'tx-2',
    amount: 5000.0,
    description: 'Salário',
    date: new Date().toISOString().split('T')[0],
    type: 'INCOME',
    categoryId: 'cat-7',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    userId: mockUserId,
  },
]

function withCategory(tx: Transaction): Transaction {
  const category = categoriesMock
    .list()
    .then(list => list.find(c => c.id === tx.categoryId) || null)
  // Return without awaiting to keep signature; components can fetch category separately if needed
  return { ...tx, category: null as any }
}

export const transactionsMock = {
  list: async (limit = 20): Promise<Transaction[]> => {
    const list = [...transactions]
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .slice(0, limit)
    return Promise.resolve(list.map(t => ({ ...t })))
  },
  get: async (id: string): Promise<Transaction | null> => {
    const tx = transactions.find(t => t.id === id) || null
    return Promise.resolve(tx ? { ...tx } : null)
  },
  create: async (input: CreateTransactionInput): Promise<Transaction> => {
    const newTx: Transaction = {
      id: `tx-${Math.random().toString(36).slice(2, 8)}`,
      amount: input.amount,
      description: input.description ?? null,
      date: input.date ?? new Date().toISOString().split('T')[0],
      type: input.type,
      categoryId: input.categoryId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: mockUserId,
    }
    transactions = [newTx, ...transactions]
    return Promise.resolve({ ...newTx })
  },
  update: async (id: string, input: UpdateTransactionInput): Promise<Transaction> => {
    const idx = transactions.findIndex(t => t.id === id)
    if (idx < 0) throw new Error('Transaction not found')
    const updated: Transaction = {
      ...transactions[idx],
      amount: input.amount ?? transactions[idx].amount,
      description: input.description ?? transactions[idx].description,
      date: input.date ?? transactions[idx].date,
      type: input.type ?? transactions[idx].type,
      categoryId: input.categoryId ?? transactions[idx].categoryId,
      updatedAt: new Date().toISOString(),
    }
    transactions[idx] = updated
    return Promise.resolve({ ...updated })
  },
  remove: async (id: string): Promise<void> => {
    transactions = transactions.filter(t => t.id !== id)
    return Promise.resolve()
  },
}
