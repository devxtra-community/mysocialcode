'use client';

import { useState } from 'react';

type EventStatus = 'pending' | 'approved' | 'rejected' | 'live' | 'ended';

interface Event {
  id: number;
  name: string;
  organizer: string;
  location: string;
  date: string;
  tickets: number;
  price: string;
  status: EventStatus;
  category: string;
}

const MOCK: Event[] = [
  {
    id: 1,
    name: 'Neon Rave Night',
    organizer: 'Aryan Mehta',
    location: 'Mumbai',
    date: 'Mar 15, 2026',
    tickets: 500,
    price: '$20',
    status: 'live',
    category: 'Music',
  },
  {
    id: 2,
    name: 'Tech Summit 2026',
    organizer: 'Priya Nair',
    location: 'Bangalore',
    date: 'Apr 02, 2026',
    tickets: 1200,
    price: '$50',
    status: 'approved',
    category: 'Tech',
  },
  {
    id: 3,
    name: 'Jazz Under Stars',
    organizer: 'Lena Schmidt',
    location: 'Delhi',
    date: 'Mar 22, 2026',
    tickets: 200,
    price: '$15',
    status: 'live',
    category: 'Music',
  },
  {
    id: 4,
    name: 'Comedy Chaos',
    organizer: 'Omar Faruk',
    location: 'Pune',
    date: 'Feb 28, 2026',
    tickets: 150,
    price: '$10',
    status: 'ended',
    category: 'Comedy',
  },
  {
    id: 5,
    name: 'Startup Pitch Night',
    organizer: 'Kai Tanaka',
    location: 'Hyderabad',
    date: 'Mar 10, 2026',
    tickets: 80,
    price: '$25',
    status: 'pending',
    category: 'Business',
  },
  {
    id: 6,
    name: 'Yoga Sunrise Retreat',
    organizer: 'Meera Rao',
    location: 'Goa',
    date: 'Mar 30, 2026',
    tickets: 60,
    price: '$35',
    status: 'pending',
    category: 'Wellness',
  },
  {
    id: 7,
    name: 'EDM Beach Blast',
    organizer: 'Dev Sharma',
    location: 'Chennai',
    date: 'Apr 10, 2026',
    tickets: 800,
    price: '$30',
    status: 'pending',
    category: 'Music',
  },
  {
    id: 8,
    name: 'Art & Wine Evening',
    organizer: 'Sophia Li',
    location: 'Mumbai',
    date: 'Mar 18, 2026',
    tickets: 120,
    price: '$45',
    status: 'approved',
    category: 'Art',
  },
  {
    id: 9,
    name: 'Blockchain Conference',
    organizer: 'Rahul Gupta',
    location: 'Delhi',
    date: 'May 01, 2026',
    tickets: 400,
    price: '$60',
    status: 'rejected',
    category: 'Tech',
  },
  {
    id: 10,
    name: 'Food Carnival 2026',
    organizer: 'Amara Patel',
    location: 'Kolkata',
    date: 'Apr 20, 2026',
    tickets: 2000,
    price: 'Free',
    status: 'pending',
    category: 'Food',
  },
];

const FILTERS = [
  'all',
  'pending',
  'approved',
  'live',
  'rejected',
  'ended',
] as const;

const statusCls: Record<string, string> = {
  live: 'bg-green-50 text-green-700 border-green-200',
  approved: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  pending: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  rejected: 'bg-red-50 text-red-600 border-red-200',
  ended: 'bg-gray-100 text-gray-500 border-gray-200',
};

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>(MOCK);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Event | null>(null);

  const approve = (id: number) =>
    setEvents((ev) =>
      ev.map((e) => (e.id === id ? { ...e, status: 'approved' } : e)),
    );
  const reject = (id: number) =>
    setEvents((ev) =>
      ev.map((e) => (e.id === id ? { ...e, status: 'rejected' } : e)),
    );

  const filtered = events.filter((e) => {
    const mf = filter === 'all' || e.status === filter;
    const ms =
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.organizer.toLowerCase().includes(search.toLowerCase());
    return mf && ms;
  });

  const counts = {
    pending: events.filter((e) => e.status === 'pending').length,
    approved: events.filter((e) => e.status === 'approved').length,
    live: events.filter((e) => e.status === 'live').length,
  };

  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-40 shadow-sm">
        <h1 className="font-display font-bold text-[18px] tracking-tight text-gray-900">
          Events
        </h1>
        <div className="w-[34px] h-[34px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          🔔
        </div>
      </header>

      <main className="p-7 flex flex-col gap-5 bg-gray-50 min-h-screen">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: 'Pending Review',
              value: counts.pending,
              color: 'text-yellow-600',
              icon: '⏳',
              f: 'pending',
            },
            {
              label: 'Approved',
              value: counts.approved,
              color: 'text-cyan-600',
              icon: '✅',
              f: 'approved',
            },
            {
              label: 'Live Now',
              value: counts.live,
              color: 'text-green-600',
              icon: '🔴',
              f: 'live',
            },
          ].map((s) => (
            <div
              key={s.label}
              onClick={() => setFilter(s.f)}
              className="bg-white border border-gray-200 rounded-2xl p-5 cursor-pointer hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-300 transition-all duration-200 shadow-sm"
            >
              <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-base mb-3">
                {s.icon}
              </div>
              <p
                className={`font-display font-extrabold text-[28px] tracking-tight leading-none ${s.color}`}
              >
                {s.value}
              </p>
              <p className="text-[11px] text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Table panel */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
          {/* Filter bar */}
          <div className="px-5 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] border transition-all cursor-pointer font-medium
                    ${
                      filter === f
                        ? 'bg-cyan-50 text-cyan-700 border-cyan-200'
                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-800'
                    }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                  <span
                    className={`px-1.5 py-px rounded-full text-[10px] ${filter === f ? 'bg-cyan-100 text-cyan-700' : 'bg-gray-100 text-gray-400'}`}
                  >
                    {f === 'all'
                      ? events.length
                      : events.filter((e) => e.status === f).length}
                  </span>
                </button>
              ))}
            </div>
            <input
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-800 placeholder-gray-400 outline-none focus:border-cyan-400 w-56"
              placeholder="🔍  Search events..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-gray-400">
                No events found.
              </div>
            ) : (
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      '#',
                      'Event',
                      'Organizer',
                      'Location',
                      'Date',
                      'Tickets',
                      'Price',
                      'Status',
                      'Actions',
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-5 py-3 text-left text-[10px] tracking-[1.5px] uppercase text-gray-400 font-medium whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((ev) => (
                    <tr
                      key={ev.id}
                      onClick={() => setSelected(ev)}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3 text-gray-400">{ev.id}</td>
                      <td className="px-5 py-3">
                        <p className="font-medium text-gray-800">{ev.name}</p>
                        <p className="text-[10px] text-gray-400">
                          {ev.category}
                        </p>
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        {ev.organizer}
                      </td>
                      <td className="px-5 py-3 text-gray-500">
                        📍 {ev.location}
                      </td>
                      <td className="px-5 py-3 text-[11px] text-gray-400 whitespace-nowrap">
                        {ev.date}
                      </td>
                      <td className="px-5 py-3 font-display font-bold text-gray-900">
                        {ev.tickets}
                      </td>
                      <td className="px-5 py-3 text-green-600 font-medium">
                        {ev.price}
                      </td>
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium ${statusCls[ev.status]}`}
                        >
                          {ev.status}
                        </span>
                      </td>
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center gap-2">
                          {(ev.status === 'pending' ||
                            ev.status === 'rejected') && (
                            <button
                              onClick={() => approve(ev.id)}
                              className="px-3 py-1.5 rounded-lg text-[11px] bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer font-medium"
                            >
                              ✓ Approve
                            </button>
                          )}
                          {(ev.status === 'pending' ||
                            ev.status === 'approved') && (
                            <button
                              onClick={() => reject(ev.id)}
                              className="px-3 py-1.5 rounded-lg text-[11px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer font-medium"
                            >
                              ✕ Reject
                            </button>
                          )}
                          {(ev.status === 'live' || ev.status === 'ended') && (
                            <span className="text-[11px] text-gray-300">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>

      {/* Modal */}
      {selected && (
        <div
          className="fixed inset-0 z-[200] bg-black/30 backdrop-blur-sm flex items-center justify-center p-6"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white border border-gray-200 rounded-2xl p-7 max-w-md w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-display font-extrabold text-[18px] mb-5 text-gray-900">
              {selected.name}
            </h2>
            {[
              ['Organizer', selected.organizer],
              ['Location', selected.location],
              ['Date', selected.date],
              ['Category', selected.category],
              ['Tickets', selected.tickets],
              ['Price', selected.price],
              ['Status', selected.status],
            ].map(([k, v]) => (
              <div
                key={String(k)}
                className="flex justify-between py-2.5 border-b border-gray-100 last:border-0 text-[12px]"
              >
                <span className="text-gray-400">{k}</span>
                <span className="font-medium text-gray-800">{String(v)}</span>
              </div>
            ))}
            <div className="flex gap-2 mt-5">
              {(selected.status === 'pending' ||
                selected.status === 'rejected') && (
                <button
                  className="flex-1 px-4 py-2.5 rounded-xl text-[12px] bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer font-medium"
                  onClick={() => {
                    approve(selected.id);
                    setSelected(null);
                  }}
                >
                  ✓ Approve
                </button>
              )}
              {(selected.status === 'pending' ||
                selected.status === 'approved') && (
                <button
                  className="flex-1 px-4 py-2.5 rounded-xl text-[12px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer font-medium"
                  onClick={() => {
                    reject(selected.id);
                    setSelected(null);
                  }}
                >
                  ✕ Reject
                </button>
              )}
              <button
                className="px-4 py-2.5 rounded-xl text-[12px] bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer font-medium"
                onClick={() => setSelected(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
