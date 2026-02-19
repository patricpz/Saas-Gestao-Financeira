import { DATA_SOURCE } from './config'
import { http } from './http'
import {
  CreateTransactionInput,
  TransactionsService,
  UpdateTransactionInput,
  Transaction,
} from '@/lib/types/domain'
import { transactionsMock } from '@/lib/mocks/transactions'

class TransactionsHttpService implements TransactionsService {
  async list(limit = 20): Promise<Transaction[]> {
    const { data } = await http.get<Transaction[]>('/transactions', {
      params: { limit },
    })
    return data
  }
  async get(id: string): Promise<Transaction | null> {
    const { data } = await http.get<Transaction>(`/transactions/${id}`)
    return data
  }
  async create(input: CreateTransactionInput): Promise<Transaction> {
    const { data } = await http.post<Transaction>('/transactions', input)
    return data
  }
  async update(id: string, input: UpdateTransactionInput): Promise<Transaction> {
    const { data } = await http.put<Transaction>(`/transactions/${id}`, input)
    return data
  }
  async remove(id: string): Promise<void> {
    await http.delete(`/transactions/${id}`)
  }
}

export const transactionsService: TransactionsService =
  DATA_SOURCE === 'mock' ? transactionsMock : new TransactionsHttpService()
