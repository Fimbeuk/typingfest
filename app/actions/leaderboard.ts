'use server'

import prisma from '@/app/lib/prisma'

interface LeaderboardEntry {
  user: {
    id: string
    email: string
    username: string | null
  }
  wpm: number
}

interface LeaderboardResult {
  global: LeaderboardEntry[]
  byChallenge: Record<string, LeaderboardEntry[]>
}

export async function getLeaderboard(): Promise<LeaderboardResult> {
  // Récupérer tous les challenges
  const challenges = await prisma.challenge.findMany()

  // Pour chaque challenge, trouver le meilleur score (WPM) de chaque utilisateur
  const byChallenge: Record<string, LeaderboardEntry[]> = {}

  for (const challenge of challenges) {
    // Récupérer toutes les runs pour ce challenge
    const runs = await prisma.run.findMany({
      where: { challengeId: challenge.id },
      include: { user: true },
    })

    // Grouper par utilisateur et trouver le meilleur WPM
    const userBestScores = new Map<string, { user: any; wpm: number }>()

    for (const run of runs) {
      const currentBest = userBestScores.get(run.userId)
      if (!currentBest || run.wpm > currentBest.wpm) {
        userBestScores.set(run.userId, {
          user: run.user,
          wpm: run.wpm,
        })
      }
    }

    const entries: LeaderboardEntry[] = Array.from(userBestScores.values()).map((item) => ({
      user: {
        id: item.user.id,
        email: item.user.email,
        username: item.user.username,
      },
      wpm: item.wpm,
    }))

    // Trier par WPM décroissant
    entries.sort((a, b) => b.wpm - a.wpm)
    byChallenge[challenge.id] = entries
  }

  // Calculer le classement global
  // Pour chaque utilisateur, calculer la moyenne de ses meilleurs scores sur les 3 challenges
  const userScores = new Map<string, number[]>()

  for (const challenge of challenges) {
    const entries = byChallenge[challenge.id]
    for (const entry of entries) {
      if (!userScores.has(entry.user.id)) {
        userScores.set(entry.user.id, [])
      }
      userScores.get(entry.user.id)!.push(entry.wpm)
    }
  }

  // Ne garder que les utilisateurs ayant complété les 3 épreuves
  const global: LeaderboardEntry[] = []

  for (const [userId, scores] of userScores.entries()) {
    if (scores.length === challenges.length) {
      const avgWpm = scores.reduce((a, b) => a + b, 0) / scores.length

      const user = await prisma.user.findUnique({
        where: { id: userId },
      })

      if (user) {
        global.push({
          user: {
            id: user.id,
            email: user.email,
            username: user.username,
          },
          wpm: Math.round(avgWpm),
        })
      }
    }
  }

  // Trier par WPM moyen décroissant
  global.sort((a, b) => b.wpm - a.wpm)

  return {
    global,
    byChallenge,
  }
}
