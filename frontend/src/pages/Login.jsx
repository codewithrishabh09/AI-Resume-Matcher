import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import Logo from '../components/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const { login, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await login(email, password)
    if (result.success) {
      toast.success('Welcome back!')
      navigate(result.role === 'employer' ? '/employer' : '/seeker')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center px-4 font-sans selection:bg-pink-500/20">

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Logo Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Welcome back</h1>
          <p className="text-white/50 text-sm">Sign in to your ResumeX account</p>
        </div>

        {/* Form Card */}
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl hover:border-pink-500/30 transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                className="input-field bg-white/[0.04] text-white border-white/10 focus:border-pink-500"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  className="input-field pr-10 bg-white/[0.04] text-white border-white/10 focus:border-pink-500"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-600/25 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-pink-400 font-bold hover:text-pink-300">
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  )
}