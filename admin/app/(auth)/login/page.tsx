'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import apiInstance from '@/app/lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const login = await apiInstance.post('/admin/login', { email, password });
      if (login.data.success) {
        router.push('/home');
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {/* Card */}
      <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-lg shadow-md">
            .
          </div>
          <span className="font-display font-extrabold text-[20px] tracking-tight text-gray-900">
            My<span className="text-cyan-500">Social Code</span>
          </span>
        </div>

        {/* Heading */}
        <h1 className="font-display font-extrabold text-[24px] tracking-tight text-gray-900">
          Welcome back
        </h1>
        <p className="text-[13px] text-gray-400 mt-1 mb-7">
          Sign in to your admin account
        </p>

        {/* Error */}
        {error && (
          <div className="mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-[12px] text-red-600 font-medium">
            ⚠️ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="flex flex-col gap-4">
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-700">
              Email address
            </label>
            <input
              type="email"
              required
              placeholder="admin@eventos.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-cyan-400 focus:bg-white transition-colors"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-[13px] text-gray-800 placeholder-gray-400 outline-none focus:border-cyan-400 focus:bg-white transition-colors pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors text-[14px] cursor-pointer"
              >
                {showPass ? 'hide' : 'show'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full bg-gradient-to-r from-cyan-500 to-violet-600 text-white font-display font-bold text-[14px] py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-md cursor-pointer"
          >
            {loading ? 'Signing in...' : 'Sign in →'}
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-[11px] text-gray-400 mt-6">
          My Social Code Admin Panel · All rights reserved
        </p>
      </div>
    </div>
  );
}
