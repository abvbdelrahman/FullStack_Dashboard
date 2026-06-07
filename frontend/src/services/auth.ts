import { apiClient } from './api'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: 'instructor' | 'admin'
  avatar?: string
}

interface AuthResponse {
  token: string
  user: AuthUser
}

export const authAPI = {
  login(email: string, password: string) {
    return apiClient.post('/auth/login', { email, password }) as Promise<AuthResponse>
  },

  register(data: { name: string; email: string; password: string; role: 'instructor' | 'admin' }) {
    return apiClient.post('/auth/register', data) as Promise<AuthResponse>
  },

  getMe() {
    return apiClient.get('/auth/me') as Promise<{ user: AuthUser }>
  },
}
