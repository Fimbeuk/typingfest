import { PrismaClient } from '@prisma/client'

// Singleton pattern pour Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

// Configuration Prisma
// Dans Prisma 7, on doit passer l'URL via les options du constructeur
// ou utiliser Prisma Accelerate avec accelerateUrl
const createPrismaClient = () => {
  const databaseUrl = process.env.DATABASE_URL
  
  if (!databaseUrl) {
    // Pendant le build, DATABASE_URL peut ne pas être disponible
    // On retourne un client avec une URL dummy qui ne sera pas utilisé
    if (process.env.NEXT_PHASE === 'phase-production-build') {
      return new PrismaClient({
        datasources: {
          db: {
            url: 'postgresql://dummy:dummy@dummy:5432/dummy',
          },
        },
      })
    }
    throw new Error('DATABASE_URL is not defined in environment variables')
  }

  // Pour Prisma 7, on doit passer l'URL via datasources
  return new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
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
