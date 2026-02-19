import { Profile } from '@/lib/types/domain'

const mockUserId = 'mock-user-1'

let profile: Profile = {
  id: 'profile-1',
  userId: mockUserId,
  fullName: 'Usuário Mock',
  avatarUrl: undefined,
  currency: 'BRL',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
}

export const profileMock = {
  get: async (): Promise<Profile | null> => {
    return Promise.resolve({ ...profile })
  },
  update: async (data: Partial<Profile>): Promise<Profile> => {
    profile = { ...profile, ...data, updatedAt: new Date().toISOString() }
    return Promise.resolve({ ...profile })
  },
}
