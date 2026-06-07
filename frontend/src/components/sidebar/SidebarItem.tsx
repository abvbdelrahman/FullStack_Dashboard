import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

interface SidebarItemProps {
  label: string
  icon: ReactNode
  active?: boolean
  collapsed?: boolean
  onClick?: () => void
  to?: string
}

export default function SidebarItem({
  label,
  icon,
  active = false,
  collapsed = false,
  onClick,
  to,
}: SidebarItemProps) {
  const baseClasses = `flex w-full items-center rounded-3xl text-sm font-semibold transition ${
    collapsed ? 'justify-center px-2 py-3' : 'gap-3 px-4 py-3'
  }`
  const iconClasses = 'flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl'
  const labelClasses = collapsed ? 'sr-only' : ''

  if (to) {
    return (
      <NavLink to={to} onClick={onClick} title={collapsed ? label : undefined} aria-label={label}>
        {({ isActive }) => (
          <div className={`${baseClasses} ${isActive ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'}`}>
            <span className={`${iconClasses} ${isActive ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
              {icon}
            </span>
            <span className={labelClasses}>{label}</span>
          </div>
        )}
      </NavLink>
    )
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={collapsed ? label : undefined}
      aria-label={label}
      className={`${baseClasses} ${active ? 'bg-orange-500 text-white shadow-md' : 'bg-white text-slate-700 hover:bg-slate-100'}`}
    >
      <span className={`${iconClasses} ${active ? 'bg-white/15 text-white' : 'bg-slate-100 text-slate-500'}`}>
        {icon}
      </span>
      <span className={labelClasses}>{label}</span>
    </button>
  )
}
