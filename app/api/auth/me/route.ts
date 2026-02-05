import { NextRequest, NextResponse } from 'next/server'
import { getUserFromToken } from '@/app/lib/auth'

export async function GET(request: NextRequest) {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    const user = await getUserFromToken(token)

    return NextResponse.json({ user })
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return NextResponse.json({ user: null }, { status: 500 })
  }
}
