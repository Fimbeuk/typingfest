import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/app/lib/auth'
import { saveRun } from '@/app/actions/challenge'

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    const user = await getUserFromToken(token)
    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { challengeId, durationMs, validCharsCount, invalidKeystrokesCount, wpm, cpm } = body

    await saveRun(
      user.id,
      challengeId,
      durationMs,
      validCharsCount,
      invalidKeystrokesCount,
      wpm,
      cpm
    )

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Erreur lors de l\'enregistrement de la run:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
