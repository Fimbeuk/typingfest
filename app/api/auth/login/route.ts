import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/app/lib/prisma'
import { generateToken } from '@/app/lib/auth'

export async function POST(request: NextRequest) {
  try {
    console.log('API route /api/auth/login appelée')
    
    const body = await request.json()
    const { email } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 })
    }

    console.log('Tentative de connexion pour:', email)

    try {
      const user = await prisma.user.upsert({
        where: { email },
        update: {},
        create: { email },
      })

      console.log('Utilisateur créé/récupéré:', user.id)

      // Générer un token JWT
      const token = generateToken({
        userId: user.id,
        email: user.email,
      })

      // Retourner le token dans la réponse JSON
      // Le client le stockera dans localStorage
      return NextResponse.json({
        user: {
          id: user.id,
          email: user.email,
          username: user.username,
        },
        token,
      })
    } catch (dbError: any) {
      console.error('Erreur Prisma:', dbError)
      return NextResponse.json(
        { error: `Erreur base de données: ${dbError.message}` },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('Erreur de connexion:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}
