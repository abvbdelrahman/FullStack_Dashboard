import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { navItems } from '../../data/sidebar'
import SearchActionButton from './SearchActionButton'
import SearchIcon from './SearchIcon'

interface SearchProps {
  placeholder?: string
  value?: string
  onChange?: (v: string) => void
}

const Search = ({ placeholder = 'Search pages', value, onChange }: SearchProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [localValue, setLocalValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchValue = value ?? localValue

  const results = useMemo(() => {
    const query = searchValue.trim().toLowerCase()
    if (!query) return navItems

    return navItems.filter((item) => {
      const label = item.label.toLowerCase()
      const path = item.to.toLowerCase().replace('/', '')
      return label.includes(query) || path.includes(query)
    })
  }, [searchValue])

  useEffect(() => {
    setIsOpen(false)
    setLocalValue('')
  }, [location.pathname])

  useEffect(() => {
    const focusSearch = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        inputRef.current?.focus()
        setIsOpen(true)
      }
    }

    window.addEventListener('keydown', focusSearch)
    return () => window.removeEventListener('keydown', focusSearch)
  }, [])

  useEffect(() => {
    const closeSearch = (event: MouseEvent) => {
      if (containerRef.current?.contains(event.target as Node)) return
      setIsOpen(false)
    }

    document.addEventListener('mousedown', closeSearch)
    return () => document.removeEventListener('mousedown', closeSearch)
  }, [])

  const updateSearch = (nextValue: string) => {
    if (onChange) {
      onChange(nextValue)
    } else {
      setLocalValue(nextValue)
    }
    setIsOpen(true)
  }

  const openResult = (to: string) => {
    navigate(to)
    setIsOpen(false)
    setLocalValue('')
  }

  const submitSearch = () => {
    const firstResult = results[0]
    if (firstResult) openResult(firstResult.to)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-3xl border-2 border-orange-500 bg-white px-4 py-2 shadow-sm">
        <SearchIcon />

        <input
          ref={inputRef}
          type="search"
          value={searchValue}
          onChange={(event) => updateSearch(event.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitSearch()
            }

            if (event.key === 'Escape') {
              setIsOpen(false)
            }
          }}
          placeholder={placeholder}
          className="w-full bg-transparent text-slate-900 placeholder:text-slate-400 outline-none"
        />

        <div className="flex items-center gap-2">
          <SearchActionButton label="Focus search">Ctrl</SearchActionButton>
          <SearchActionButton label="Focus search">K</SearchActionButton>
        </div>
      </div>

      {isOpen && searchValue.trim() && (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl">
          {results.length === 0 ? (
            <div className="p-4 text-sm text-slate-500">No pages found.</div>
          ) : (
            <div className="max-h-80 overflow-y-auto p-2">
              {results.map((item) => (
                <button
                  key={item.to}
                  type="button"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => openResult(item.to)}
                  className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-semibold text-slate-700 transition hover:bg-orange-50 hover:text-orange-700"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Search
