import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface HoursSpentCardProps {
  data: Array<{ month: string; Teaching: number; Admin: number }>
}

const HoursSpentCard = ({ data }: HoursSpentCardProps) => (
  <article className="rounded-4xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-center justify-between gap-4 text-sm text-slate-500">
      <span>Workspace Activity</span>
      <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">Live data</div>
    </div>

    <div className="mt-6 h-72">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
          <Tooltip
            cursor={{ fill: 'rgba(251, 146, 60, 0.08)' }}
            contentStyle={{ borderRadius: 12, border: '1px solid #e2e8f0' }}
          />
          <Bar dataKey="Teaching" radius={[12, 12, 0, 0]} fill="#fb6d1c" barSize={28} />
          <Bar dataKey="Admin" radius={[12, 12, 0, 0]} fill="#f7c1a0" barSize={28} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </article>
)

export default HoursSpentCard
