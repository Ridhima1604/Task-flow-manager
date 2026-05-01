import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session) redirect('/login')

  return (
    <div className="flex h-screen overflow-hidden bg-page">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="min-h-full p-6 md:p-8 max-w-7xl mx-auto pt-16 md:pt-8">
          {children}
        </div>
      </main>
    </div>
  )
}
