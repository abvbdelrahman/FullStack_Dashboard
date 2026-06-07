import React from 'react'

interface NameProps {
  name?: string
  avatarSrc?: string
  role?: string
  onLogout?: () => void
}

const Name: React.FC<NameProps> = ({ name = 'Account', avatarSrc, role, onLogout }) => {
  return (
    <div className="inline-flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-3 py-2 shadow-sm">
      <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
        {avatarSrc ? (
          <img src={avatarSrc} alt={name} className="h-full w-full object-cover" />
        ) : (
          <svg viewBox="0 0 24 24" className="h-10 w-10 p-2 text-slate-500" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="10" r="3" />
            <path d="M5.5 20c1.5-2 4-3 6.5-3s5 1 6.5 3" />
          </svg>
        )}
      </div>

      <div className="hidden sm:block">
        <p className="text-sm font-semibold text-slate-900">{name}</p>
        {role && <p className="text-xs capitalize text-slate-500">{role}</p>}
      </div>
      {onLogout && (
        <button
          type="button"
          onClick={onLogout}
          className="rounded-2xl bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-orange-600"
        >
          Logout
        </button>
      )}
    </div>
  )
}

export default Name
