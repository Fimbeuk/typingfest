import { PrismaClient } from '@prisma/client'

// Singleton pattern pour Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

// Configuration Prisma
// Dans Prisma 7, PrismaClient lit automatiquement DATABASE_URL depuis process.env
// La configuration de la base de données se fait via prisma.config.ts
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

if (process.env.NODE_ENV === 'production') {
  // En production, créer une nouvelle instance
  prisma = createPrismaClient()
} else {
  // En développement, utiliser le singleton global pour éviter les connexions multiples
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  prisma = global.prisma
}

export default prisma
