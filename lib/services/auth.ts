export type RegisterInput = { name: string; email: string; password: string }

export const authService = {
  async register(_data: RegisterInput): Promise<{ ok: boolean; error?: string }> {
    return Promise.resolve({ ok: true })
  },
}
