import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3'
import path from 'path'

// Utiliser un chemin absolu pour la base de données
const dbPath = path.join(process.cwd(), 'dev.db')
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` })
const prisma = new PrismaClient({ adapter })

async function main() {
  const challenges = [
    {
      slug: "proust-swann",
      title: "Du côté de chez Swann",
      author: "Marcel Proust",
      text: "Longtemps, je me suis couché de bonne heure."
    },
    {
      slug: "hugo-miserables",
      title: "Les Misérables",
      author: "Victor Hugo",
      text: "Il dormait. Quoique le sort fût pour lui bien étrange,"
    },
    {
      slug: "baudelaire-fleurs",
      title: "Les Fleurs du mal",
      author: "Charles Baudelaire",
      text: "Là, tout n'est qu'ordre et beauté, luxe, calme et volupté."
    }
  ]

  for (const c of challenges) {
    await prisma.challenge.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
    })
  }
}

main()
  .then(() => console.log("Base de données initialisée avec les 3 épreuves !"))
  .finally(() => prisma.$disconnect())
