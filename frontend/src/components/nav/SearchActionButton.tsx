import type { ReactNode } from 'react'

interface SearchActionButtonProps {
  label: string
  children: ReactNode
}

const SearchActionButton = ({ label, children }: SearchActionButtonProps) => (
  <kbd
    aria-label={label}
    className="flex h-10 items-center justify-center rounded-2xl bg-orange-50 px-3 text-orange-600 font-semibold"
  >
    {children}
  </kbd>
)

export default SearchActionButton
