import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Briefcase } from 'lucide-react'
import toast from 'react-hot-toast'
import useAuthStore from '../store/authStore'

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center gap-2 justify-center mb-4">
            <Briefcase className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold">Resume<span className="text-indigo-600">AI</span></span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1">Get started for free</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role selector */}
            <div className="grid grid-cols-2 gap-3">
              {['seeker', 'employer'].map(r => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 px-4 rounded-lg border text-sm font-medium transition-colors capitalize
                    ${form.role === r
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-400'
                    }`}
                >
                  {r === 'seeker' ? '👤 Job Seeker' : '🏢 Employer'}
                </button>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="John Doe"
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="input-field"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                minLength={6}
              />
            </div>

            <button type="submit" className="btn-primary w-full py-2.5" disabled={isLoading}>
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-indigo-600 font-medium hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}