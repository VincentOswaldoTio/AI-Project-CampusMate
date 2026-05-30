import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import MobileNav from './MobileNav'

export default function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      
      {/* Sidebar Desktop - Tersembunyi di mobile (< 768px) */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Konten Utama - Menambahkan padding kiri sebesar lebar sidebar di desktop */}
      <div className="flex flex-col md:pl-[240px] min-h-screen transition-all duration-300">
        
        {/* Header */}
        <Header />

        {/* Area Halaman - pb-24 di mobile agar tidak terhalang bottom nav */}
        <main className="flex-1 px-4 py-6 md:p-8 max-w-5xl w-full mx-auto pb-24 md:pb-8">
          <Outlet />
        </main>

        {/* Navigation Bar Mobile - Tersembunyi di desktop */}
        <MobileNav />

      </div>
    </div>
  )
}
