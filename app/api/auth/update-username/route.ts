import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/app/lib/auth'
import { updateUsername } from '@/app/actions/user'

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
    const { username } = body

    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Username requis' }, { status: 400 })
    }

    const updatedUser = await updateUsername(user.id, username)

    return NextResponse.json({ user: updatedUser })
  } catch (error: any) {
    console.error('Erreur lors de la mise à jour du username:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
