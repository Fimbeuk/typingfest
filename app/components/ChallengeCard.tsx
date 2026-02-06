'use client'

import Link from 'next/link'
import { useAuth } from '@/app/hooks/useAuth'
import { useEffect, useState } from 'react'
import { getAuthToken } from '@/app/lib/auth-client'

interface LeaderboardEntry {
  user: {
    id: string
    email: string
    username: string | null
  }
  wpm: number
}

interface ChallengeCardProps {
  challenge: {
    id: string
    slug: string
    title: string
    author: string
  }
  card: {
    slug: string
    title: string
    author: string
    color: string
  }
  leaderboard: LeaderboardEntry[]
}

export default function ChallengeCard({ challenge, card, leaderboard }: ChallengeCardProps) {
  const { user } = useAuth()
  const [bestScore, setBestScore] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBestScore = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const token = getAuthToken()
        if (!token) {
          setLoading(false)
          return
        }

        const response = await fetch('/api/user/best-scores', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (response.ok) {
          const data = await response.json()
          setBestScore(data.bestScores[challenge.id] || null)
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du meilleur score:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchBestScore()
  }, [user, challenge.id])

  return (
    <div className="flex flex-col">
      <Link href={`/play/${challenge.id}`} className="group">
        <div className={`bg-gradient-to-br ${card.color} rounded-lg shadow-lg p-8 text-white transform transition-transform hover:scale-105`}>
          <h2 className="text-2xl font-bold mb-2">{card.title}</h2>
          <p className="text-white/80 mb-4">{card.author}</p>
          {user && !loading && bestScore !== null && (
            <div className="mt-4 text-sm font-semibold">
              <div className="text-white/90">Mon meilleur score:</div>
              <div className="text-xl font-bold">{bestScore} WPM</div>
            </div>
          )}
          {user && !loading && bestScore === null && (
            <div className="mt-4 text-sm text-white/70">
              Aucun score encore
            </div>
          )}
          <div className="mt-6 text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
            Cliquez pour commencer →
          </div>
        </div>
      </Link>
      
      {/* Leaderboard */}
      <div className="mt-4 bg-white rounded-lg shadow-lg p-4">
        <h3 className="text-lg font-bold text-gray-900 mb-3">Classement</h3>
        {leaderboard.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            <div className="grid grid-cols-[auto_1fr_auto] gap-4 text-sm font-semibold text-gray-600 pb-2 border-b">
              <div className="w-8 text-center">#</div>
              <div>Utilisateur</div>
              <div className="text-right">Score</div>
            </div>
            {leaderboard.map((entry, index) => (
              <div
                key={entry.user.id}
                className="grid grid-cols-[auto_1fr_auto] gap-4 text-sm py-1 hover:bg-gray-50 rounded"
              >
                <div className="w-8 text-center text-gray-500 font-medium">
                  {index + 1}
                </div>
                <div className="text-gray-900 truncate">
                  {entry.user.username || entry.user.email}
                </div>
                <div className="text-right font-semibold text-gray-900">
                  {entry.wpm} WPM
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm text-center py-4">
            Aucun score encore
          </p>
        )}
      </div>
    </div>
  )
}
