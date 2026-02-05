'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getAuthToken, removeAuthToken, setAuthToken } from '@/app/lib/auth-client'

interface User {
  id: string
  email: string
  username: string | null
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = getAuthToken()
    if (!token) {
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setUser(data.user)
        } else {
          removeAuthToken()
        }
      } else {
        removeAuthToken()
      }
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'auth:', error)
      removeAuthToken()
    } finally {
      setLoading(false)
    }
  }

  const login = async (email: string) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Erreur inconnue' }))
        throw new Error(errorData.error || 'Erreur lors de la connexion')
      }

      const data = await response.json()
      setAuthToken(data.token)
      setUser(data.user)

      return data.user
    } catch (error: any) {
      throw error
    }
  }

  const logout = () => {
    removeAuthToken()
    setUser(null)
    router.push('/login')
  }

  return {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  }
}
