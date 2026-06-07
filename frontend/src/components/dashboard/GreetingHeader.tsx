const GreetingHeader = ({ name }: { name?: string }) => (
  <section className="rounded-4xl border border-slate-200 bg-white p-8 shadow-sm">
    <h1 className="text-3xl font-bold text-slate-900">Hello {name || 'Instructor'}</h1>
    <p className="mt-3 text-slate-500">Review your courses, sessions, and team tasks.</p>
  </section>
)

export default GreetingHeader
