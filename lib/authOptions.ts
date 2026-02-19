import { prisma } from '@/lib/prisma';
import CredentialsProvider from 'next-auth/providers/credentials';
import type { NextAuthOptions } from 'next-auth';
import bcrypt from 'bcryptjs';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60,
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
    maxAge: 30 * 24 * 60 * 60,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error('Email e senha são obrigatórios');

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            password: true,
          },
        });

        if (!user || !user.password)
          throw new Error('Credenciais inválidas');

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) throw new Error('Credenciais inválidas');

        const accessToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64');

        return {
          id: user.id,
          email: user.email,
          name: user.name || '',
          image: user.image || null,
          accessToken,
        };
      },
    }),
  ],
  pages: {
    signIn: '/login',
    error: '/login',
  },
  debug: process.env.NODE_ENV === 'development',
};
