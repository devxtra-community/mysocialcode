'use client';

import { useEffect, useState } from 'react';
import api from '@/app/lib/api';

type UserStatus = 'active' | 'inactive' | 'banned';

interface User {
  id: string;
  name: string;
  email: string;
  joinedAt: string;
  eventsCount: number;
  ticketsCount: number;
  status: UserStatus;
}

const STATUS_FILTERS = ['all', 'active', 'inactive', 'banned'] as const;

const statusCls: Record<UserStatus, string> = {
  active: 'bg-green-50 text-green-800 border-green-300',
  inactive: 'bg-gray-100 text-gray-800 border-gray-300',
  banned: 'bg-red-50 text-red-700 border-red-300',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [counts, setCounts] = useState({
    all: 0,
    active: 0,
    inactive: 0,
    banned: 0,
  });
  const [filter, setFilter] = useState<'all' | UserStatus>('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/admin/users', {
        params: {
          status: filter !== 'all' ? filter : undefined,
          search: search || undefined,
        },
      });
      setUsers(res.data.data);
      setCounts(res.data.counts);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [filter, search]);

  const toggleStatus = async (userId: string) => {
    try {
      await api.put(`/admin/users/${userId}/status`);
      fetchUsers();
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  return (
    <>
      <header className="h-[60px] bg-white border-b border-gray-200 flex items-center justify-between px-7 sticky top-0 z-40 shadow-sm">
        <div className="flex items-center gap-3">
          <h1 className="font-display font-bold text-[18px] tracking-tight text-gray-900">
            Users
          </h1>
          <span className="text-[11px] text-gray-800 bg-gray-100 border border-gray-300 px-2 py-0.5 rounded-full">
            {counts.all} total
          </span>
        </div>
      </header>

      <main className="p-7 flex flex-col gap-5 bg-gray-50 min-h-screen text-gray-900">
        <div className="grid grid-cols-4 gap-4 lg:grid-cols-2">
          {[
            { label: 'Total Users', value: counts.all },
            { label: 'Active', value: counts.active },
            { label: 'Inactive', value: counts.inactive },
            { label: 'Banned', value: counts.banned },
          ].map((s) => (
            <div
              key={s.label}
              className="bg-white border border-gray-300 rounded-2xl p-5 shadow-sm"
            >
              <p className="font-bold text-[26px] text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-700">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="bg-white border border-gray-300 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between gap-3">
            <div className="flex gap-2">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-full text-[11px] border ${
                    filter === f
                      ? 'bg-cyan-100 text-gray-900 border-cyan-300'
                      : 'bg-white text-gray-800 border-gray-300'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            <input
              className="border border-gray-300 px-3 py-2 text-[12px] text-gray-900"
              placeholder="Search..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="p-6 text-center text-gray-700">Loading...</div>
          ) : (
            <table className="w-full text-[12px] text-gray-900">
              <thead>
                <tr className="border-b bg-gray-100 text-gray-800">
                  <th className="px-5 py-3 text-left">ID</th>
                  <th className="px-5 py-3 text-left">Name</th>
                  <th className="px-5 py-3 text-left">Email</th>
                  <th className="px-5 py-3 text-left">Events</th>
                  <th className="px-5 py-3 text-left">Tickets</th>
                  <th className="px-5 py-3 text-left">Status</th>
                  <th className="px-5 py-3 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-gray-200">
                    <td className="px-5 py-3">{u.id}</td>
                    <td className="px-5 py-3 font-medium">{u.name}</td>
                    <td className="px-5 py-3">{u.email}</td>
                    <td className="px-5 py-3">{u.eventsCount}</td>
                    <td className="px-5 py-3">{u.ticketsCount}</td>
                    <td className="px-5 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full border ${statusCls[u.status]}`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="px-3 py-1 bg-gray-200 text-gray-900 rounded"
                      >
                        Toggle
                      </button>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-6 text-center text-gray-700"
                    >
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </>
  );
}
