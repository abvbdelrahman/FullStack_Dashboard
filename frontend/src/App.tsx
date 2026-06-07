import { Suspense, lazy, useEffect, useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Nav from './components/nav/Nav'
import SideBar from './components/sidebar/SideBar'
import { AuthProvider } from './context/AuthContext'
import { useAuth } from './context/useAuth'

const AuthPage = lazy(() => import('./pages/AuthPage'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const Assignments = lazy(() => import('./pages/Assignments'))
const CourseDetails = lazy(() => import('./pages/CourseDetails'))
const CourseLearning = lazy(() => import('./pages/CourseLearning'))
const Courses = lazy(() => import('./pages/Courses'))
const Classes = lazy(() => import('./pages/Classes'))
const Discussions = lazy(() => import('./pages/Discussions'))
const Downloads = lazy(() => import('./pages/Downloads'))
const NotFound = lazy(() => import('./pages/NotFound'))
const Notes = lazy(() => import('./pages/Notes'))
const Recordings = lazy(() => import('./pages/Recordings'))
const Resources = lazy(() => import('./pages/Resources'))
const Schedule = lazy(() => import('./pages/Schedule'))
const Settings = lazy(() => import('./pages/Settings'))

const pageFallback = (
  <div className="p-6">
    <div className="rounded-4xl border border-slate-200 bg-white p-8 text-slate-600 shadow-sm">
      Loading page...
    </div>
  </div>
)

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  )
}

const AppRoutes = () => {
  const { user, loading } = useAuth()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    if (typeof window === 'undefined') return true
    return window.matchMedia('(min-width: 1024px)').matches
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const updateSidebar = () => setSidebarOpen(mediaQuery.matches)

    updateSidebar()
    mediaQuery.addEventListener('change', updateSidebar)
    return () => mediaQuery.removeEventListener('change', updateSidebar)
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100 text-slate-600">
        Loading account...
      </div>
    )
  }

  if (!user && location.pathname !== '/login' && location.pathname !== '/register') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <Suspense fallback={pageFallback}>
        {!user ? (
          <Routes>
            <Route path="/login" element={<AuthPage mode="login" />} />
            <Route path="/register" element={<AuthPage mode="register" />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        ) : (
          <div className="flex">
            <SideBar isOpen={sidebarOpen} />
            <main className="flex-1">
              <Nav isOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((open) => !open)} />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Navigate to="/" replace />} />
                <Route path="/register" element={<Navigate to="/" replace />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/courses/:id" element={<CourseDetails />} />
                <Route path="/courses/:id/learn" element={<CourseLearning />} />
                <Route path="/recordings" element={<Recordings />} />
                <Route path="/discussions" element={<Discussions />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/notes" element={<Notes />} />
                <Route path="/downloads" element={<Downloads />} />
                <Route path="/classes" element={<Classes />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        )}
      </Suspense>
    </div>
  )
}

export default App
