import { CategoriesService, Category, TransactionType } from '@/lib/types/domain'
import { DATA_SOURCE } from './config'
import { http } from './http'
import { categoriesMock } from '@/lib/mocks/categories'

class CategoriesHttpService implements CategoriesService {
  async list(): Promise<Category[]> {
    const { data } = await http.get<Category[]>('/categories')
    return data
  }
  async create(category: { name: string; type: TransactionType }): Promise<Category> {
    const { data } = await http.post<Category>('/categories', category)
    return data
  }
  async remove(id: string): Promise<void> {
    await http.delete('/categories', { params: { id } })
  }
}

export const categoriesService: CategoriesService =
  DATA_SOURCE === 'mock' ? categoriesMock : new CategoriesHttpService()
