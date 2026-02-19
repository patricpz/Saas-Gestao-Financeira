import { DATA_SOURCE } from './config'
import { http } from './http'
import { Profile, ProfileService } from '@/lib/types/domain'
import { profileMock } from '@/lib/mocks/profile'

class ProfileHttpService implements ProfileService {
  async get(): Promise<Profile | null> {
    const { data } = await http.get<Profile>('/profile')
    return data
  }
  async update(data: Partial<Profile>): Promise<Profile> {
    const { data: updated } = await http.patch<Profile>('/profile', data)
    return updated
  }
}

export const profileService: ProfileService =
  DATA_SOURCE === 'mock' ? (profileMock as ProfileService) : new ProfileHttpService()
