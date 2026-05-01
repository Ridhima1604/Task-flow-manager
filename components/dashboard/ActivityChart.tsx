'use client'

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function ActivityChart({ data }: { data: any[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
        <defs>
          <linearGradient id="gradCreated" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-primary)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--accent-primary)" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="gradCompleted" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--accent-success)" stopOpacity={0.25} />
            <stop offset="95%" stopColor="var(--accent-success)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" vertical={false} />
        <XAxis dataKey="day" tick={{ fill: 'var(--chart-label)', fontSize: 11 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: 'var(--chart-label)', fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
        <Tooltip content={<CustomTooltip />} cursor={{ stroke: 'var(--border-default)', strokeWidth: 1 }} />
        <Area type="monotone" dataKey="created" stroke="var(--accent-primary)" strokeWidth={2.5} fill="url(#gradCreated)" activeDot={{ r: 4, fill: 'var(--accent-primary)', stroke: 'white', strokeWidth: 2 }} />
        <Area type="monotone" dataKey="completed" stroke="var(--accent-success)" strokeWidth={2.5} fill="url(#gradCompleted)" activeDot={{ r: 4, fill: 'var(--accent-success)', stroke: 'white', strokeWidth: 2 }} />
      </AreaChart>
    </ResponsiveContainer>
  )
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-xl p-3 text-xs shadow-modal">
      <p className="text-[var(--text-secondary)] mb-2 font-medium">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-[var(--text-secondary)] capitalize">{p.name}:</span>
          <span className="text-[var(--text-primary)] font-semibold">{p.value}</span>
        </div>
      ))}
    </div>
  )
}
