import { useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/useAuth'

const demoCredentials = {
  email: 'instructor@knowledgepulse.com',
  password: 'password123',
}

const AuthPage = ({ mode }: { mode: 'login' | 'register' }) => {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<'instructor' | 'admin'>('instructor')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const redirectTo = (location.state as { from?: string } | null)?.from || '/'

  if (user) {
    return <Navigate to={redirectTo} replace />
  }

  const submit = async () => {
    if (!email.trim() || !password) {
      setError('Email and password are required.')
      return
    }

    if (mode === 'register' && !name.trim()) {
      setError('Name is required.')
      return
    }

    try {
      setSubmitting(true)
      setError(null)
      if (mode === 'login') {
        await login(email.trim(), password)
      } else {
        await register({ name: name.trim(), email: email.trim(), password, role })
      }
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setSubmitting(false)
    }
  }

  const loginAsDemo = async () => {
    try {
      setSubmitting(true)
      setError(null)
      await login(demoCredentials.email, demoCredentials.password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Demo login failed.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto flex min-h-[calc(100vh-48px)] max-w-6xl items-center">
        <section className="grid w-full overflow-hidden rounded-4xl border border-slate-200 bg-white shadow-sm xl:grid-cols-[1fr_460px]">
          <div className="flex flex-col justify-between bg-slate-950 p-10 text-white">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-orange-300">Instructor Admin LMS</p>
              <h1 className="mt-5 text-4xl font-bold">Manage courses, sessions, and class operations.</h1>
              <p className="mt-4 max-w-2xl text-slate-300">
                Access is limited to instructors and admins. Student enrollment and checkout flows stay disabled for this scope.
              </p>
            </div>
            <div className="mt-10 grid gap-3 text-sm text-slate-300 sm:grid-cols-3">
              <span className="rounded-2xl bg-white/10 p-4">Courses</span>
              <span className="rounded-2xl bg-white/10 p-4">Assignments</span>
              <span className="rounded-2xl bg-white/10 p-4">Schedule</span>
            </div>
          </div>

          <div className="p-8">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === 'login' ? 'Sign in' : 'Create account'}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {mode === 'login' ? 'Use your instructor or admin account.' : 'Create an instructor/admin account.'}
            </p>

            <div className="mt-6 space-y-4">
              {mode === 'register' && (
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Full name"
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                />
              )}
              <input
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Email"
                type="email"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
              <input
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                type="password"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
              />
              {mode === 'register' && (
                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value as 'instructor' | 'admin')}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400"
                >
                  <option value="instructor">Instructor</option>
                  <option value="admin">Admin</option>
                </select>
              )}
            </div>

            {error && <p className="mt-4 rounded-2xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}

            <button
              type="button"
              onClick={submit}
              disabled={submitting}
              className="mt-6 w-full rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {submitting ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
            </button>

            {mode === 'login' && (
              <button
                type="button"
                onClick={loginAsDemo}
                disabled={submitting}
                className="mt-3 w-full rounded-2xl border border-orange-200 bg-orange-50 px-5 py-3 text-sm font-semibold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
              >
                Login as a demo
              </button>
            )}

            <button
              type="button"
              onClick={() => navigate(mode === 'login' ? '/register' : '/login')}
              className="mt-4 w-full rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {mode === 'login' ? 'Create an account' : 'Already have an account'}
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}

export default AuthPage
