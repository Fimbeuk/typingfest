import { PrismaClient } from '@prisma/client'

// Singleton pattern pour Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Configuration Prisma
// Dans Prisma 7, PrismaClient lit automatiquement DATABASE_URL depuis process.env
// La configuration de la base de données se fait via prisma.config.ts
const createPrismaClient = () => {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  })
}

// Initialisation du client Prisma
// En production, créer une nouvelle instance
// En développement, utiliser le singleton global pour éviter les connexions multiples
let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = createPrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  prisma = global.prisma
}

export default prisma
