import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
  try {
    const { email, password, name } = await request.json();

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists with this email' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    // Create user profile
    await prisma.profile.create({
      data: {
        userId: user.id,
        fullName: name,
        currency: 'BRL',
      },
    });

    // Create default categories for the user
    const defaultCategories = [
      { name: 'Alimentação', type: 'EXPENSE' },
      { name: 'Moradia', type: 'EXPENSE' },
      { name: 'Transporte', type: 'EXPENSE' },
      { name: 'Lazer', type: 'EXPENSE' },
      { name: 'Saúde', type: 'EXPENSE' },
      { name: 'Educação', type: 'EXPENSE' },
      { name: 'Salário', type: 'INCOME' },
      { name: 'Freelance', type: 'INCOME' },
      { name: 'Investimentos', type: 'INCOME' },
    ];

    await prisma.category.createMany({
      data: defaultCategories.map(category => ({
        ...category,
        userId: user.id,
      })),
    });

    return NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'An error occurred during registration' },
      { status: 500 }
    );
  }
}
