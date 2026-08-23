import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowRight, Users, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'
import Logo from '../components/Logo'

export default function Register() {
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    password: '',
    role: searchParams.get('role') || 'seeker'
  })
  const { register, isLoading } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const result = await register(form.full_name, form.email, form.password, form.role)
    if (result.success) {
      toast.success('Account created!')
      navigate(result.role === 'employer' ? '/employer' : '/seeker')
    } else {
      toast.error(result.error)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center px-4 py-12 font-sans selection:bg-pink-500/20">

      {/* Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-pink-600/15 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-white mb-2 tracking-tight">Create an account</h1>
          <p className="text-white/50 text-sm">Get started with ResumeX AI Matching Engine</p>
        </div>

        {/* Card */}
        <div className="p-8 bg-white/[0.03] border border-white/10 rounded-3xl backdrop-blur-xl shadow-2xl hover:border-pink-500/30 transition-all">
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3 mb-2">
              {[
                { value: 'seeker', label: 'Job Seeker', icon: Users },
                { value: 'employer', label: 'Employer', icon: Building2 }
              ].map(({ value, label, icon: Icon }) => {
                const active = form.role === value
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setForm({ ...form, role: value })}
                    className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border text-xs font-bold transition-all
                      ${active
                        ? 'bg-gradient-to-r from-pink-500/20 to-purple-500/20 border-pink-500/40 text-pink-300 shadow-md shadow-pink-900/30'
                        : 'bg-white/5 border-white/10 text-white/50 hover:border-white/20'
                      }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-pink-400' : 'text-white/40'}`} />
                    {label}
                  </button>
                )
              })}
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                className="input-field bg-white/[0.04] text-white border-white/10 focus:border-pink-500"
                placeholder="John Doe"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Email</label>
              <input
                type="email"
                className="input-field bg-white/[0.04] text-white border-white/10 focus:border-pink-500"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                className="input-field bg-white/[0.04] text-white border-white/10 focus:border-pink-500"
                placeholder="Min 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button
              type="submit"
              className="w-full py-3.5 mt-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-pink-600/25 transition-all hover:scale-[1.02]"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : (
                <span className="flex items-center justify-center gap-2">
                  Create Account <ArrowRight className="h-4 w-4" />
                </span>
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-white/40 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-pink-400 font-bold hover:text-pink-300">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}