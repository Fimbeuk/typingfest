import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

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

  console.log("✅ Base de données initialisée avec les 3 épreuves !")
}

main()
  .catch((e) => {
    console.error("❌ Erreur lors de l'initialisation:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
