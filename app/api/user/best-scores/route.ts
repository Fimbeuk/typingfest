import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/app/lib/auth'
import { getUserBestScore } from '@/app/actions/challenge'
import { getAllChallenges } from '@/app/actions/challenge'

export async function GET(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    // Récupérer tous les challenges
    const challenges = await getAllChallenges()

    // Récupérer le meilleur score pour chaque challenge
    const bestScores: Record<string, number | null> = {}
    for (const challenge of challenges) {
      const bestScore = await getUserBestScore(user.id, challenge.id)
      bestScores[challenge.id] = bestScore
    }

    return NextResponse.json({ bestScores })
  } catch (error: any) {
    console.error('Erreur lors de la récupération des meilleurs scores:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
