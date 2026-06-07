import { useState } from 'react'
import Logo from './Logo'
import SidebarItem from './SidebarItem'
import { navItems } from '../../data/sidebar'

interface SideBarProps {
  isOpen: boolean
}

const SideBar = ({ isOpen }: SideBarProps) => {
  const [items, setItems] = useState(navItems)

  const handleItemClick = (label: string) => {
    setItems((prevItems) =>
      prevItems.map((item) => ({
        ...item,
        active: item.label === label,
      })),
    )
  }

  return (
    <aside
      className={`min-h-screen bg-white text-slate-900 transition-all duration-300 ease-in-out ${
        isOpen
          ? 'w-72 border-r border-slate-200 px-5 py-6'
          : 'w-0 overflow-hidden p-0 opacity-0 lg:w-20 lg:border-r lg:border-slate-200 lg:px-3 lg:py-6 lg:opacity-100'
      }`}
    >
      <div className={isOpen ? '' : 'hidden lg:block'}>
        <Logo collapsed={!isOpen} />

        <nav className="mt-10 space-y-2">
          {items.map((item) => (
            <SidebarItem
              key={item.label}
              label={item.label}
              icon={item.icon}
              active={item.active}
              collapsed={!isOpen}
              to={item.to}
              onClick={() => handleItemClick(item.label)}
            />
          ))}
        </nav>
      </div>
    </aside>
  )
}

export default SideBar
