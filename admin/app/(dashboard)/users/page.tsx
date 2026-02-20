'use client';

import { useState } from 'react';

type UserStatus = 'active' | 'inactive' | 'banned';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined: string;
  events: number;
  tickets: number;
  status: UserStatus;
  role: 'user' | 'organizer';
}

const MOCK: User[] = [
  {
    id: 1,
    name: 'Aryan Mehta',
    email: 'aryan@gmail.com',
    phone: '+91 9876543210',
    joined: 'Feb 18, 2026',
    events: 3,
    tickets: 12,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 2,
    name: 'Lena Schmidt',
    email: 'lena@gmail.com',
    phone: '+49 1234567890',
    joined: 'Feb 17, 2026',
    events: 1,
    tickets: 5,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 3,
    name: 'Kai Tanaka',
    email: 'kai@gmail.com',
    phone: '+81 9012345678',
    joined: 'Feb 16, 2026',
    events: 0,
    tickets: 8,
    status: 'banned',
    role: 'user',
  },
  {
    id: 4,
    name: 'Priya Nair',
    email: 'priya@gmail.com',
    phone: '+91 8765432109',
    joined: 'Feb 15, 2026',
    events: 2,
    tickets: 20,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 5,
    name: 'Omar Faruk',
    email: 'omar@gmail.com',
    phone: '+88 7654321098',
    joined: 'Feb 14, 2026',
    events: 1,
    tickets: 3,
    status: 'inactive',
    role: 'user',
  },
  {
    id: 6,
    name: 'Sophia Li',
    email: 'sophia@gmail.com',
    phone: '+86 6543210987',
    joined: 'Feb 13, 2026',
    events: 1,
    tickets: 7,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 7,
    name: 'Dev Sharma',
    email: 'dev@gmail.com',
    phone: '+91 5432109876',
    joined: 'Feb 12, 2026',
    events: 2,
    tickets: 15,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 8,
    name: 'Meera Rao',
    email: 'meera@gmail.com',
    phone: '+91 4321098765',
    joined: 'Feb 11, 2026',
    events: 1,
    tickets: 9,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 9,
    name: 'Rahul Gupta',
    email: 'rahul@gmail.com',
    phone: '+91 3210987654',
    joined: 'Feb 10, 2026',
    events: 0,
    tickets: 2,
    status: 'inactive',
    role: 'user',
  },
  {
    id: 10,
    name: 'Amara Patel',
    email: 'amara@gmail.com',
    phone: '+91 2109876543',
    joined: 'Feb 09, 2026',
    events: 1,
    tickets: 30,
    status: 'active',
    role: 'organizer',
  },
  {
    id: 11,
    name: 'James Wong',
    email: 'james@gmail.com',
    phone: '+1 1098765432',
    joined: 'Feb 08, 2026',
    events: 0,
    tickets: 4,
    status: 'active',
    role: 'user',
  },
  {
    id: 12,
    name: 'Nina Petrov',
    email: 'nina@gmail.com',
    phone: '+7 9887654321',
    joined: 'Feb 07, 2026',
    events: 0,
    tickets: 1,
    status: 'banned',
    role: 'user',
  },
];

const STATUS_FILTERS = ['all', 'active', 'inactive', 'banned'] as const;

const statusCls: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  inactive: 'bg-gray-100 text-gray-500 border-gray-200',
  banned: 'bg-red-50 text-red-600 border-red-200',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>(MOCK);
  const [filter, setFilter] = useState('all');
  const [roleFilter, setRole] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<User | null>(null);

  const setStatus = (id: number, status: UserStatus) =>
    setUsers((u) => u.map((x) => (x.id === id ? { ...x, status } : x)));

  const toggle = (id: number, cur: UserStatus) => {
    if (cur === 'active') setStatus(id, 'inactive');
    if (cur === 'inactive') setStatus(id, 'active');
  };

  const ban = (id: number) => setStatus(id, 'banned');
  const unban = (id: number) => setStatus(id, 'active');

  const filtered = users.filter((u) => {
    const mf = filter === 'all' || u.status === filter;
    const mr = roleFilter === 'all' || u.role === roleFilter;
    const ms =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return mf && mr && ms;
  });

  const counts = {
    active: users.filter((u) => u.status === 'active').length,
    inactive: users.filter((u) => u.status === 'inactive').length,
    banned: users.filter((u) => u.status === 'banned').length,
  };

  return (
    <>
      {/* Topbar */}
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-[18px] tracking-tight text-gray-900">
            Users
          </h1>
          <span className="text-[11px] text-gray-500 bg-gray-100 border border-gray-200 px-2 py-0.5 rounded-full">
            {users.length} total
          </span>
        </div>
        <div className="w-[34px] h-[34px] bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center text-sm text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
          🔔
        </div>
      </header>

      <main className="p-7 flex flex-col gap-5 bg-gray-50 min-h-screen">
        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4 lg:grid-cols-2">
          {[
            {
              label: 'Total Users',
              value: users.length,
              color: 'text-gray-900',
              icon: '👥',
            },
            {
              label: 'Active',
              value: counts.active,
              color: 'text-green-600',
              icon: '✅',
            },
            {
              label: 'Inactive',
              value: counts.inactive,
              color: 'text-yellow-600',
              icon: '💤',
            },
            {
              label: 'Banned',
              value: counts.banned,
              color: 'text-red-600',
              icon: '🚫',
            },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:-translate-y-0.5 hover:shadow-md hover:border-cyan-300 transition-all duration-200 shadow-sm"
            >
              <div className="w-9 h-9 bg-gray-100 border border-gray-200 rounded-xl flex items-center justify-center text-base mb-3">
                {s.icon}
              </div>
              <p
                className={`font-display font-extrabold text-[26px] tracking-tight leading-none ${s.color}`}
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
              {STATUS_FILTERS.map((f) => (
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
                      ? users.length
                      : users.filter((u) => u.status === f).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRole(e.target.value)}
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-700 outline-none focus:border-cyan-400 cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="user">User</option>
                <option value="organizer">Organizer</option>
              </select>
              <input
                className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-[12px] text-gray-800 placeholder-gray-400 outline-none focus:border-cyan-400 w-52"
                placeholder="🔍  Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            {filtered.length === 0 ? (
              <div className="py-12 text-center text-[13px] text-gray-400">
                No users found.
              </div>
            ) : (
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {[
                      '#',
                      'User',
                      'Role',
                      'Joined',
                      'Events',
                      'Tickets',
                      'Status',
                      'Enable/Disable',
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
                  {filtered.map((u) => (
                    <tr
                      key={u.id}
                      onClick={() => setSelected(u)}
                      className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3 text-gray-400">{u.id}</td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-[12px] font-bold text-white flex-shrink-0">
                            {u.name[0]}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">
                              {u.name}
                            </p>
                            <p className="text-[10px] text-gray-400">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                            u.role === 'organizer'
                              ? 'bg-violet-50 text-violet-700 border-violet-200'
                              : 'bg-cyan-50 text-cyan-700 border-cyan-200'
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[11px] text-gray-400 whitespace-nowrap">
                        {u.joined}
                      </td>
                      <td className="px-5 py-3 font-display font-bold text-gray-900">
                        {u.events}
                      </td>
                      <td className="px-5 py-3 font-display font-bold text-gray-900">
                        {u.tickets}
                      </td>
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] border font-medium ${statusCls[u.status]}`}
                        >
                          {u.status}
                        </span>
                      </td>

                      {/* Toggle */}
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {u.status !== 'banned' ? (
                          <button
                            onClick={() => toggle(u.id, u.status)}
                            className={`relative w-10 h-[22px] rounded-full border transition-all duration-200 cursor-pointer flex-shrink-0
                              ${
                                u.status === 'active'
                                  ? 'bg-green-100 border-green-300'
                                  : 'bg-gray-200 border-gray-300'
                              }`}
                          >
                            <div
                              className={`absolute top-[2px] w-4 h-4 rounded-full transition-all duration-200
                              ${
                                u.status === 'active'
                                  ? 'left-[21px] bg-green-500 shadow-sm'
                                  : 'left-[2px] bg-gray-400'
                              }`}
                            ></div>
                          </button>
                        ) : (
                          <span className="text-[11px] text-gray-300">—</span>
                        )}
                      </td>

                      {/* Ban/Unban */}
                      <td
                        className="px-5 py-3"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {u.status !== 'banned' ? (
                          <button
                            onClick={() => ban(u.id)}
                            className="px-3 py-1.5 rounded-lg text-[11px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer font-medium"
                          >
                            🚫 Ban
                          </button>
                        ) : (
                          <button
                            onClick={() => unban(u.id)}
                            className="px-3 py-1.5 rounded-lg text-[11px] bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer font-medium"
                          >
                            ✓ Unban
                          </button>
                        )}
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
            className="bg-white border border-gray-200 rounded-2xl p-7 max-w-[440px] w-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-4 mb-5">
              <div className="w-[52px] h-[52px] rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-[20px] font-bold text-white flex-shrink-0">
                {selected.name[0]}
              </div>
              <div>
                <h2 className="font-display font-extrabold text-[18px] text-gray-900">
                  {selected.name}
                </h2>
                <p className="text-[12px] text-gray-400">{selected.email}</p>
              </div>
            </div>
            {[
              ['Phone', selected.phone],
              ['Joined', selected.joined],
              ['Role', selected.role],
              ['Events Organized', selected.events],
              ['Tickets Bought', selected.tickets],
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
            <div className="flex gap-2 mt-5 flex-wrap">
              {selected.status !== 'banned' && (
                <>
                  <button
                    onClick={() => {
                      toggle(selected.id, selected.status);
                      setSelected(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-[12px] bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer font-medium"
                  >
                    {selected.status === 'active' ? '💤 Disable' : '✅ Enable'}
                  </button>
                  <button
                    onClick={() => {
                      ban(selected.id);
                      setSelected(null);
                    }}
                    className="flex-1 px-4 py-2.5 rounded-xl text-[12px] bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-colors cursor-pointer font-medium"
                  >
                    🚫 Ban User
                  </button>
                </>
              )}
              {selected.status === 'banned' && (
                <button
                  onClick={() => {
                    unban(selected.id);
                    setSelected(null);
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl text-[12px] bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-colors cursor-pointer font-medium"
                >
                  ✓ Unban User
                </button>
              )}
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2.5 rounded-xl text-[12px] bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors cursor-pointer font-medium"
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
