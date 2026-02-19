export type DataSourceType = 'mock' | 'http'

const source = (process.env.NEXT_PUBLIC_DATA_SOURCE || 'mock').toLowerCase()

export const DATA_SOURCE: DataSourceType = source === 'http' ? 'http' : 'mock'

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:3001'
