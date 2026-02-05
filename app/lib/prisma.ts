import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

// Singleton pattern pour Prisma Client
declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined
}

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  // En production, créer une nouvelle instance
  const dbPath = path.join(process.cwd(), 'dev.db')
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
  prisma = new PrismaClient({ adapter })
} else {
  // En développement, utiliser le singleton global pour éviter les connexions multiples
  if (!global.prisma) {
    const dbPath = path.join(process.cwd(), 'dev.db')
    const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
    global.prisma = new PrismaClient({ adapter })
  }
  prisma = global.prisma
}

export default prisma
