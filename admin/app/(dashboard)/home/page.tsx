'use client'

const STATS = [
  { label: 'Total Users',  value: '24,521', change: '+12.4%', up: true,  icon: '👤' },
  { label: 'Live Events',  value: '138',    change: '+3.1%',  up: true,  icon: '🎯' },
  { label: 'Tickets Sold', value: '9,872',  change: '-1.2%',  up: false, icon: '🎟️' },
  { label: 'Revenue',      value: '$48,320',change: '+8.7%',  up: true,  icon: '💰' },
]

const ACTIVITY = [
  { color: '#16a34a', text: "New user Aryan Mehta signed up via Google",         time: '2 min ago' },
  { color: '#0891b2', text: "Event 'Neon Rave Night' went live — 340 tickets",   time: '8 min ago' },
  { color: '#dc2626', text: "User Kai Tanaka was banned by admin",                time: '15 min ago' },
  { color: '#d97706', text: "Boost activated for 'Jazz Under Stars'",             time: '22 min ago' },
  { color: '#16a34a', text: "Revenue milestone: $48,000 crossed this month",      time: '1 hr ago' },
  { color: '#7c3aed', text: "New event 'Tech Summit 2026' submitted for review",  time: '2 hr ago' },
]

const TOP_EVENTS = [
  { name: 'Neon Rave Night',  tickets: 340,  revenue: '$6,800',  status: 'live' },
  { name: 'Tech Summit 2026', tickets: 890,  revenue: '$44,500', status: 'upcoming' },
  { name: 'Jazz Under Stars', tickets: 120,  revenue: '$2,400',  status: 'live' },
  { name: 'Comedy Chaos',     tickets: 55,   revenue: '$825',    status: 'ended' },
]

const statusCls: Record<string, string> = {
  live:     'bg-green-50 text-green-700 border-green-200',
  upcoming: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  ended:    'bg-gray-100 text-gray-500 border-gray-200',
}

export default function HomePage() {
  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-40 shadow-sm">
        <div>
          <h1 className="font-display font-bold text-[18px] tracking-tight text-gray-900">Dashboard</h1>
          <p className="text-[10px] text-gray-400">Thu, Feb 19 2026</p>
        </div>
        <div className="w-[34px] h-[34px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          🔔
        </div>
      </header>

      <main className="p-7 flex flex-col gap-6 bg-gray-50 min-h-screen">

        {/* Welcome banner */}
        <div className="bg-gradient-to-r from-cyan-500/10 to-violet-500/10 border border-cyan-200 rounded-2xl px-6 py-5 flex items-center justify-between">
          <div>
            <h2 className="font-display font-extrabold text-[20px] tracking-tight text-gray-900">Good morning, Admin 👋</h2>
            <p className="text-[12px] text-gray-500 mt-1">Here's what's happening with your platform today.</p>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-green-600 font-medium">
            <span className="w-2 h-2 rounded-full bg-green-500 live-dot inline-block"></span>
            System Operational
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 lg:grid-cols-2">
          {STATS.map((s) => (
            <div key={s.label} className="relative bg-white border border-gray-200 rounded-2xl p-5 overflow-hidden hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-300 transition-all duration-200 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-base">
                  {s.icon}
                </div>
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium ${s.up ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-500'}`}>
                  {s.up ? '▲' : '▼'} {s.change}
                </span>
              </div>
              <p className="font-display font-extrabold text-[26px] tracking-tight leading-none text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
              <div className="mt-3 h-[3px] bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full"
                  style={{ width: s.up ? '72%' : '35%' }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Two column */}
        <div className="grid grid-cols-[1fr_360px] gap-5 lg:grid-cols-1">

          {/* Top Events */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-display font-bold text-[14px] text-gray-900">Top Events This Month</span>
              <a href="/events" className="text-[11px] text-cyan-600 font-medium no-underline hover:opacity-70 transition-opacity">VIEW ALL →</a>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Event', 'Tickets', 'Revenue', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[1.5px] uppercase text-gray-400 font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TOP_EVENTS.map((e) => (
                    <tr key={e.name} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="px-5 py-3 font-medium text-gray-800">{e.name}</td>
                      <td className="px-5 py-3 font-display font-bold text-gray-900">{e.tickets}</td>
                      <td className="px-5 py-3 text-green-600 font-medium">{e.revenue}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium ${statusCls[e.status]}`}>
                          {e.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity feed */}
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="font-display font-bold text-[14px] text-gray-900">Live Activity</span>
              <span className="flex items-center gap-2 text-[11px] text-green-600 font-medium">
                <span className="w-[7px] h-[7px] rounded-full bg-green-500 live-dot inline-block"></span>
                LIVE
              </span>
            </div>
            <div>
              {ACTIVITY.map((a, i) => (
                <div key={i} className={`flex items-start gap-3 px-5 py-3 ${i < ACTIVITY.length - 1 ? 'border-b border-gray-100' : ''} hover:bg-gray-50 transition-colors`}>
                  <div className="w-[7px] h-[7px] rounded-full mt-[6px] flex-shrink-0"
                    style={{ background: a.color, boxShadow: `0 0 6px ${a.color}40` }}></div>
                  <div>
                    <p className="text-[12px] leading-relaxed text-gray-700">{a.text}</p>
                    <p className="text-[10px] text-gray-400 mt-0.5">{a.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
    </>
  )
}