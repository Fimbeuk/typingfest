'use server'

import prisma from '@/app/lib/prisma'

export async function getChallenge(idOrSlug: string) {
  // Essayer d'abord par ID, puis par slug
  const byId = await prisma.challenge.findUnique({
    where: { id: idOrSlug },
  })
  if (byId) return byId

  return await prisma.challenge.findUnique({
    where: { slug: idOrSlug },
  })
}

export async function getAllChallenges() {
  return await prisma.challenge.findMany({
    orderBy: { title: 'asc' },
  })
}

export async function saveRun(
  userId: string,
  challengeId: string,
  durationMs: number,
  validCharsCount: number,
  invalidKeystrokesCount: number,
  wpm: number,
  cpm: number
) {
  return await prisma.run.create({
    data: {
      userId,
      challengeId,
      durationMs,
      validCharsCount,
      invalidKeystrokesCount,
      wpm,
      cpm,
    },
  })
}

export async function getUserBestScore(userId: string, challengeId: string) {
  const bestRun = await prisma.run.findFirst({
    where: {
      userId,
      challengeId,
    },
    orderBy: {
      wpm: 'desc',
    },
  })

  return bestRun ? bestRun.wpm : null
}