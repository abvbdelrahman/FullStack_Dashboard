import { Link } from "react-router-dom"

const Logo = ({ collapsed = false }: { collapsed?: boolean }) => (
  <Link
    to={"/"}
    aria-label="Designo dashboard"
    title={collapsed ? 'Designo' : undefined}
    className={`flex items-center rounded-3xl bg-white py-2 shadow-sm ${collapsed ? 'justify-center px-2' : 'gap-3 px-3'}`}
  >
    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-orange-500 text-2xl font-bold text-white">
      O
    </div>
    <div className={collapsed ? 'sr-only' : 'flex flex-col'}>
      <span className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-900">Designo</span>
    </div>
  </Link>
)

export default Logo
