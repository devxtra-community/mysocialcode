'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/home', icon: '⬛', label: 'Home' },
  { href: '/events', icon: '🎯', label: 'Events' },
  { href: '/users', icon: '👥', label: 'Users' },
];

export default function Sidebar() {
  const path = usePathname();

  return (
    <aside className="w-[240px] bg-white border-r border-gray-200 fixed top-0 left-0 bottom-0 flex flex-col z-50 shadow-sm">
      {/* Logo */}
      <div className="px-5 py-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 flex items-center justify-center text-base flex-shrink-0 shadow-md">
          ⚡
        </div>
        <span className="font-display font-extrabold text-[17px] tracking-tight text-gray-900">
          My<span className="text-cyan-500">Social Code</span>
        </span>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        <p className="text-[9px] tracking-[2px] text-gray-400 uppercase px-3 pb-2">
          Main Menu
        </p>

        {NAV.map((item) => {
          const active = path === item.href || path.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                relative flex items-center gap-3 px-3 py-[10px] rounded-xl
                text-[13px] transition-all duration-200 no-underline
                ${
                  active
                    ? 'bg-cyan-50 text-cyan-700 border border-cyan-200 font-medium sidebar-active'
                    : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900 border border-transparent'
                }
              `}
            >
              <span className="text-[15px] flex-shrink-0">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile at bottom */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-[10px] bg-gray-50 border border-gray-200 rounded-xl">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            A
          </div>
          <div className="min-w-0">
            <p className="text-[12px] font-medium text-gray-900 truncate">
              Super Admin
            </p>
            <p className="text-[10px] text-gray-400 truncate">
              admin@eventos.com
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
