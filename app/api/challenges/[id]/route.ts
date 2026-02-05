import { NextRequest, NextResponse } from 'next/server'
import { getChallenge } from '@/app/actions/challenge'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const challenge = await getChallenge(id)

    if (!challenge) {
      return NextResponse.json({ error: 'Challenge non trouvé' }, { status: 404 })
    }

    return NextResponse.json(challenge)
  } catch (error: any) {
    console.error('Erreur lors de la récupération du challenge:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
