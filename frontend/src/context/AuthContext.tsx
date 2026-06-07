import { useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { authAPI, type AuthUser } from '../services/auth'
import { AuthContext, type AuthContextValue } from './authContextValue'

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const response = await authAPI.getMe()
        setUser(response.user)
      } catch {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      async login(email, password) {
        const response = await authAPI.login(email, password)
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setUser(response.user)
      },
      async register(data) {
        const response = await authAPI.register(data)
        localStorage.setItem('token', response.token)
        localStorage.setItem('user', JSON.stringify(response.user))
        setUser(response.user)
      },
      updateUser(nextUser) {
        localStorage.setItem('user', JSON.stringify(nextUser))
        setUser(nextUser)
      },
      logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        setUser(null)
      },
    }),
    [loading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
