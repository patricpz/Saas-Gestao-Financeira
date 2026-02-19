import { Category, TransactionType } from '@/lib/types/domain'

const mockUserId = 'mock-user-1'

let categories: Category[] = [
  { id: 'cat-1', name: 'Alimentação', type: 'EXPENSE', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-2', name: 'Moradia', type: 'EXPENSE', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-3', name: 'Transporte', type: 'EXPENSE', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-4', name: 'Lazer', type: 'EXPENSE', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-5', name: 'Saúde', type: 'EXPENSE', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-6', name: 'Educação', type: 'EXPENSE', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-7', name: 'Salário', type: 'INCOME', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-8', name: 'Freelance', type: 'INCOME', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: 'cat-9', name: 'Investimentos', type: 'INCOME', userId: mockUserId, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
]

export const categoriesMock = {
  list: async (): Promise<Category[]> => {
    return Promise.resolve([...categories])
  },
  create: async (data: { name: string; type: TransactionType }): Promise<Category> => {
    const newCat: Category = {
      id: `cat-${Math.random().toString(36).slice(2, 8)}`,
      name: data.name,
      type: data.type,
      userId: mockUserId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    categories = [newCat, ...categories]
    return Promise.resolve(newCat)
  },
  remove: async (id: string): Promise<void> => {
    categories = categories.filter(c => c.id !== id)
    return Promise.resolve()
  },
}
