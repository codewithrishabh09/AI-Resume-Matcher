import { Link, useNavigate } from 'react-router-dom'
import { LogOut, Briefcase, User } from 'lucide-react'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()

  const isSeeker = user?.role === 'seeker'
  const isEmployer = user?.role === 'employer'

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <Briefcase className="h-7 w-7 text-indigo-600" />
            <span className="text-xl font-semibold text-gray-900">
              Resume<span className="text-indigo-600">AI</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-6">
            {isSeeker && (
              <>
                <Link to="/seeker" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/seeker/jobs" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                  Browse Jobs
                </Link>
                <Link to="/seeker/upload" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                  Upload Resume
                </Link>
              </>
            )}
            {isEmployer && (
              <>
                <Link to="/employer" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/employer/post-job" className="text-gray-600 hover:text-indigo-600 text-sm font-medium">
                  Post Job
                </Link>
              </>
            )}
          </div>

          {/* User menu */}
          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{user.full_name}</span>
                  <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-medium capitalize">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center gap-1 text-gray-500 hover:text-red-500 text-sm transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link to="/login" className="btn-secondary text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Sign Up</Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  )
}