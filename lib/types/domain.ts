export type TransactionType = 'INCOME' | 'EXPENSE'

export interface Category {
  id: string
  name: string
  type: TransactionType
  userId?: string
  createdAt?: string
  updatedAt?: string
}

export interface Transaction {
  id: string
  amount: number
  description: string | null
  date: string
  type: TransactionType
  categoryId: string
  category?: Category | null
  createdAt: string
  updatedAt: string
  userId: string
}

export interface Profile {
  id: string
  userId: string
  fullName?: string
  avatarUrl?: string
  currency?: string
  createdAt: string
  updatedAt: string
}

export interface CreateTransactionInput {
  amount: number
  description?: string | null
  date?: string
  type: TransactionType
  categoryId: string
}

export interface UpdateTransactionInput {
  amount?: number
  description?: string | null
  date?: string
  type?: TransactionType
  categoryId?: string
}

export interface TransactionsService {
  list(limit?: number): Promise<Transaction[]>
  get(id: string): Promise<Transaction | null>
  create(input: CreateTransactionInput): Promise<Transaction>
  update(id: string, input: UpdateTransactionInput): Promise<Transaction>
  remove(id: string): Promise<void>
}

export interface CategoriesService {
  list(): Promise<Category[]>
  create(category: { name: string; type: TransactionType }): Promise<Category>
  remove(id: string): Promise<void>
}

export interface ProfileService {
  get(): Promise<Profile | null>
  update(data: Partial<Profile>): Promise<Profile>
}
