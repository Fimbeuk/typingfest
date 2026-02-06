import { PrismaClient } from '@prisma/client'

// Singleton pattern pour Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // En production, créer une nouvelle instance
  prisma = new PrismaClient({
    datasourceUrl: process.env.DATABASE_URL,
  })
} else {
  // En développement, utiliser le singleton global pour éviter les connexions multiples
  if (!global.prisma) {
    global.prisma = new PrismaClient({
      datasourceUrl: process.env.DATABASE_URL,
    })
  }
  prisma = global.prisma
}

export default prisma
