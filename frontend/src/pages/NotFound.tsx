import { Link } from 'react-router-dom'

const NotFound = () => (
  <div className="p-6">
    <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="text-3xl font-bold text-slate-900">Page not found</h1>
      <p className="mt-2 text-slate-500">The page you requested does not exist.</p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-2xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
      >
        Back to dashboard
      </Link>
    </section>
  </div>
)

export default NotFound
