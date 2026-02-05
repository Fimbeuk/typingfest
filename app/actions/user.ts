'use server'

import prisma from '@/app/lib/prisma'
import { headers } from 'next/headers'
import { getUserFromToken } from '@/app/lib/auth'

export async function updateUsername(userId: string, username: string) {
  // Vérifier l'unicité
  const existing = await prisma.user.findUnique({
    where: { username },
  })

  if (existing && existing.id !== userId) {
    throw new Error('Ce pseudo est déjà pris')
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { username },
  })

  return user
}

export async function getCurrentUser() {
  try {
    // Récupérer le token depuis les headers
    const headersList = await headers()
    const authHeader = headersList.get('authorization')
    const token = authHeader?.replace('Bearer ', '') || null

    if (!token) return null

    return await getUserFromToken(token)
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error)
    return null
  }
}
