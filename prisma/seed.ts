import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Criar usuário de exemplo com senha hasheada
  const hashedPassword = await bcrypt.hash('123456', 12)
  
  const user = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin',
      password: hashedPassword,
    },
  })

  // Criar categorias padrão para receitas
  const incomeCategories = [
    { name: 'Salário', type: 'INCOME' },
    { name: 'Freelance', type: 'INCOME' },
    { name: 'Investimentos', type: 'INCOME' },
    { name: 'Outros', type: 'INCOME' },
  ]

  // Criar categorias padrão para despesas
  const expenseCategories = [
    { name: 'Alimentação', type: 'EXPENSE' },
    { name: 'Transporte', type: 'EXPENSE' },
    { name: 'Moradia', type: 'EXPENSE' },
    { name: 'Saúde', type: 'EXPENSE' },
    { name: 'Educação', type: 'EXPENSE' },
    { name: 'Lazer', type: 'EXPENSE' },
    { name: 'Outros', type: 'EXPENSE' },
  ]

  const allCategories = [...incomeCategories, ...expenseCategories]

  for (const categoryData of allCategories) {
    await prisma.category.upsert({
      where: {
        name_userId: {
          name: categoryData.name,
          userId: user.id,
        },
      },
      update: {},
      create: {
        name: categoryData.name,
        type: categoryData.type,
        userId: user.id,
      },
    })
  }

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
