import { PrismaClient } from '@prisma/client'

// Singleton pattern pour Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // En production, créer une nouvelle instance
  // Prisma lit automatiquement DATABASE_URL depuis les variables d'environnement
  prisma = new PrismaClient()
} else {
  // En développement, utiliser le singleton global pour éviter les connexions multiples
  if (!global.prisma) {
    // Prisma lit automatiquement DATABASE_URL depuis les variables d'environnement
    global.prisma = new PrismaClient()
  }
  prisma = global.prisma
}

export default prisma
