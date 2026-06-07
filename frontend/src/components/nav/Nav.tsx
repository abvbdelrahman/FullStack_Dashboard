import Name from './Name'
import Search from './Search'
import Notification from './Notification'
import { useAuth } from '../../context/useAuth'

interface NavProps {
  isOpen: boolean
  onToggleSidebar: () => void
}

const Nav = ({ isOpen, onToggleSidebar }: NavProps) => {
  const { user, logout } = useAuth()

  return (
    <div className="flex items-center justify-between h-16 gap-6 border-b border-slate-200 bg-slate-100 px-6">
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-slate-300 hover:text-slate-900"
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            {isOpen ? <polyline points="9 18 15 12 9 6" /> : <polyline points="15 18 9 12 15 6" />}
          </svg>
        </button>

        <div className="w-full">
          <Search />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Notification />
        <Name name={user?.name || 'Account'} avatarSrc={user?.avatar} role={user?.role} onLogout={logout} />
      </div>
    </div>
  )
}

export default Nav
