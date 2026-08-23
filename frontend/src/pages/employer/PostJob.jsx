import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

export default function PostJob() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    salary_range: '',
    required_skills: []
  })
  const [skillInput, setSkillInput] = useState('')
  const [loading, setLoading] = useState(false)

  const addSkill = () => {
    const skill = skillInput.trim().toLowerCase()
    if (skill && !form.required_skills.includes(skill)) {
      setForm(prev => ({ ...prev, required_skills: [...prev.required_skills, skill] }))
      setSkillInput('')
    }
  }

  const removeSkill = (skill) => {
    setForm(prev => ({
      ...prev,
      required_skills: prev.required_skills.filter(s => s !== skill)
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.required_skills.length === 0) return toast.error('Add at least one skill')
    setLoading(true)
    try {
      await api.post('/jobs/', form)
      toast.success('Job posted successfully!')
      navigate('/employer')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Failed to post job')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Post a New Job</h1>
          <p className="text-white/50 text-sm mt-1">Specify job role details and required skill set for ML matching</p>
        </div>

        <div className="card-glow">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Job Title *</label>
              <input
                type="text"
                className="input-field py-3 bg-white/[0.04] text-white border-white/10"
                placeholder="e.g. Senior Machine Learning Engineer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Job Description *</label>
              <textarea
                rows={5}
                className="input-field py-3 bg-white/[0.04] text-white border-white/10 resize-none leading-relaxed"
                placeholder="Describe the role, responsibilities, culture, and key requirements..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Location</label>
                <input
                  type="text"
                  className="input-field py-3 bg-white/[0.04] text-white border-white/10"
                  placeholder="e.g. Remote / San Francisco, CA"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Salary Range</label>
                <input
                  type="text"
                  className="input-field py-3 bg-white/[0.04] text-white border-white/10"
                  placeholder="e.g. $140,000 - $180,000"
                  value={form.salary_range}
                  onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">Required Skills *</label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  className="input-field flex-1 py-3 bg-white/[0.04] text-white border-white/10"
                  placeholder="Type skill (e.g. python, pytorch) and press Enter"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="btn-secondary px-5 font-semibold">Add</button>
              </div>
              {form.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-4 bg-white/[0.03] border border-white/10 rounded-xl">
                  {form.required_skills.map(skill => (
                    <span key={skill} className="flex items-center gap-1.5 bg-violet-500/20 text-violet-300 border border-violet-500/30 text-xs font-semibold px-3 py-1.5 rounded-lg">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)} className="hover:text-white transition-colors">
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <button type="submit" className="btn-primary flex-1 py-3 font-semibold shadow-violet-600/30" disabled={loading}>
                {loading ? 'Publishing Position...' : 'Publish Job Listing'}
              </button>
              <button type="button" onClick={() => navigate('/employer')} className="btn-secondary px-6">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}