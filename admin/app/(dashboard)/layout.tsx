import type { ReactNode } from 'react'
import Sidebar from '@/components/admin/sideBar'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-950">
      <Sidebar />
      <div className="ml-[240px] flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}