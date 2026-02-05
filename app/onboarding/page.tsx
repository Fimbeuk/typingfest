'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/hooks/useAuth'
import OnboardingForm from './OnboardingForm'

export default function OnboardingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/login')
      } else if (user.username) {
        router.push('/play')
      }
    }
  }, [user, loading, router])

  if (loading || !user || user.username) {
    return <div>Chargement...</div>
  }

  return <OnboardingForm userId={user.id} />
}
