'use client'

import { useRouter } from 'next/navigation'
import TypingArea from './TypingArea'
import { getAuthToken } from '@/app/lib/auth-client'
import toast from 'react-hot-toast'

interface TypingAreaClientProps {
  challengeId: string
  text: string
  userId: string
}

export default function TypingAreaClient({ challengeId, text, userId }: TypingAreaClientProps) {
  const router = useRouter()

  const handleComplete = async (stats: {
    durationMs: number
    mistakes: number
    wpm: number
    cpm: number
  }) => {
    try {
      const token = getAuthToken()
      if (!token) {
        router.push('/login')
        return
      }

      const response = await fetch('/api/runs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          challengeId,
          durationMs: stats.durationMs,
          validCharsCount: text.length,
          invalidKeystrokesCount: stats.mistakes,
          wpm: stats.wpm,
          cpm: stats.cpm,
        }),
      })

      if (response.ok) {
        toast.success(`Score enregistré ! ${stats.wpm} WPM`, {
          duration: 3000,
        })
        router.push('/play?completed=true')
      } else {
        console.error('Erreur lors de l\'enregistrement de la run')
        toast.error('Erreur lors de l\'enregistrement du score')
        router.push('/play')
      }
    } catch (error) {
      console.error('Erreur:', error)
      toast.error('Une erreur est survenue')
      router.push('/play')
    }
  }

  return <TypingArea text={text} onComplete={handleComplete} />
}
