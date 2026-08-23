import { Link, useLocation } from 'react-router-dom'
import { LogOut, User, LayoutDashboard, Upload, Search, PlusCircle } from 'lucide-react'
import useAuthStore from '../store/authStore'
import Logo from './Logo'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const location = useLocation()

  const isActive = (path) => location.pathname === path

  const seekerLinks = [
    { to: '/seeker', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/seeker/jobs', label: 'Browse Jobs', icon: Search },
    { to: '/seeker/upload', label: 'Upload Resume', icon: Upload },
  ]

  const employerLinks = [
    { to: '/employer', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/employer/post-job', label: 'Post Job', icon: PlusCircle },
  ]

  const links = user?.role === 'seeker' ? seekerLinks : employerLinks

  return (
    <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#08080C]/85 backdrop-blur-2xl shadow-xl shadow-black/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Logo size="md" />

          {/* Nav Links */}
          {user && (
            <div className="flex items-center gap-1.5">
              {links.map(({ to, label, icon: Icon }) => {
                const active = isActive(to)
                return (
                  <Link
                    key={to}
                    to={to}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all
                      ${active
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border border-pink-500/30 shadow-md shadow-purple-900/30'
                        : 'text-white/60 hover:text-white hover:bg-white/5'
                      }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-pink-400' : 'text-white/50'}`} />
                    {label}
                  </Link>
                )
              })}
            </div>
          )}

          {/* User menu */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-2.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                  <div className="w-6 h-6 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
                    <User className="h-3.5 w-3.5 text-white" />
                  </div>
                  <span className="text-xs font-bold text-white/90">{user.full_name}</span>
                  <span className="px-2 py-0.5 bg-pink-500/10 text-pink-300 rounded-full text-[10px] font-extrabold capitalize border border-pink-500/20">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1.5 text-white/40 hover:text-rose-400 text-xs font-bold transition-colors px-3 py-2 rounded-xl hover:bg-rose-500/10"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary text-xs py-2 px-4">Login</Link>
                <Link to="/register" className="btn-primary text-xs py-2 px-4 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700">Sign Up</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}