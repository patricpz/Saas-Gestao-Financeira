import { prisma } from './prisma';

interface ProfileData {
  fullName?: string;
  avatarUrl?: string;
  currency?: string;
}

export const profileUtils = {
  async findByUserId(userId: string) {
    return (prisma as any).profile.findUnique({
      where: { userId },
    });
  },

  async updateByUserId(userId: string, data: ProfileData) {
    return (prisma as any).profile.update({
      where: { userId },
      data,
    });
  },

  async upsertByUserId(userId: string, data: ProfileData) {
    return (prisma as any).profile.upsert({
      where: { userId },
      create: { ...data, userId },
      update: data,
    });
  },
};
