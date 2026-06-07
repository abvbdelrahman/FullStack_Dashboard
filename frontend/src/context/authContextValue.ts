import { createContext } from 'react'
import type { AuthUser } from '../services/auth'

export interface AuthContextValue {
  user: AuthUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: { name: string; email: string; password: string; role: 'instructor' | 'admin' }) => Promise<void>
  updateUser: (user: AuthUser) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
