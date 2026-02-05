'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import TypingAreaClient from '@/app/components/TypingAreaClient'

interface Challenge {
  id: string
  title: string
  author: string
  text: string
}

export default function PlayChallengePage() {
  const params = useParams()
  const id = params.id as string
  const { user, loading } = useAuth()
  const router = useRouter()
  const [challenge, setChallenge] = useState<Challenge | null>(null)
  const [loadingChallenge, setLoadingChallenge] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  useEffect(() => {
    const fetchChallenge = async () => {
      try {
        const response = await fetch(`/api/challenges/${id}`)
        if (response.ok) {
          const data = await response.json()
          setChallenge(data)
        } else {
          router.push('/play')
        }
      } catch (error) {
        console.error('Erreur lors du chargement du challenge:', error)
        router.push('/play')
      } finally {
        setLoadingChallenge(false)
      }
    }

    if (id) {
      fetchChallenge()
    }
  }, [id, router])

  if (loading || loadingChallenge || !user || !challenge) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-gray-600">Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-4 md:mb-8 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{challenge.title}</h1>
          <p className="text-gray-600">par {challenge.author}</p>
        </div>
        <TypingAreaClient challengeId={challenge.id} text={challenge.text} userId={user.id} />
      </div>
    </div>
  )
}
