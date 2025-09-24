import { PrismaClient, Prisma } from '@prisma/client';

// Extend the Prisma client to include our custom methods
type ExtendedPrismaClient = ReturnType<typeof createExtendedPrismaClient>;

// Create a singleton instance of the Prisma client
declare global {
  // eslint-disable-next-line no-var
  var _prisma: ExtendedPrismaClient | undefined;
}

const prisma = global._prisma || createExtendedPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  global._prisma = prisma;
}

function createExtendedPrismaClient() {
  const client = new PrismaClient().$extends({
    model: {
      $allModels: {
        // Generic method to find by any field
        async findBy<T, A>(
          this: T,
          field: keyof Prisma.Args<T, 'findFirst'>['where'],
          value: any
        ): Promise<A | null> {
          const context = Prisma.getExtensionContext(this);
          // @ts-ignore - Dynamic access to prisma model
          return context.findFirst({
            where: { [field]: value },
          });
        },
        
        // Generic method to update by any field
        async updateBy<T, A>(
          this: T,
          field: keyof Prisma.Args<T, 'update'>['where'],
          value: any,
          data: Prisma.Args<T, 'update'>['data']
        ): Promise<A> {
          const context = Prisma.getExtensionContext(this);
          // @ts-ignore - Dynamic access to prisma model
          return context.update({
            where: { [field]: value },
            data,
          });
        },
        
        // Generic method to upsert by any field
        async upsertBy<T, A>(
          this: T,
          field: keyof Prisma.Args<T, 'upsert'>['where'],
          value: any,
          create: Prisma.Args<T, 'create'>['data'],
          update: Prisma.Args<T, 'update'>['data']
        ): Promise<A> {
          const context = Prisma.getExtensionContext(this);
          // @ts-ignore - Dynamic access to prisma model
          return context.upsert({
            where: { [field]: value },
            create,
            update,
          });
        },
      },
    },
  }) as PrismaClient & {
    $extends: typeof createExtendedPrismaClient;
  };

  return client;
}

export const extendedPrisma = prisma;
export default prisma;
