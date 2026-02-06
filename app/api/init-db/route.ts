import { NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'

// Route temporaire pour initialiser la base de données
// ⚠️ SUPPRIMEZ CETTE ROUTE APRÈS AVOIR INITIALISÉ LA BASE DE DONNÉES
export async function GET() {
  try {
    // Vérifier la connexion
    await prisma.$connect()
    
    // Initialiser les données (créer les épreuves)
    // Note: Les migrations doivent être appliquées manuellement via Vercel CLI
    // ou via la commande: npx prisma migrate deploy
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

    let created = 0
    for (const c of challenges) {
      try {
        await prisma.challenge.upsert({
          where: { slug: c.slug },
          update: {},
          create: c,
        })
        created++
      } catch (err: any) {
        // Si la table n'existe pas, on aura une erreur
        if (err.message?.includes('does not exist') || err.message?.includes('Table')) {
          return NextResponse.json({ 
            success: false, 
            error: 'Les tables n\'existent pas encore. Veuillez d\'abord exécuter: npx prisma migrate deploy',
            hint: 'Utilisez Vercel CLI: vercel env pull .env.local && npx prisma migrate deploy'
          }, { status: 500 })
        }
        throw err
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: `Base de données initialisée avec succès ! ${created} épreuve(s) créée(s).` 
    })
  } catch (error: any) {
    console.error('Erreur lors de l\'initialisation:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message,
      details: error.code || 'Unknown error'
    }, { status: 500 })
  }
}
