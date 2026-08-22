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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Post a New Job</h1>
          <p className="text-gray-500 mt-1">Fill in the details to attract the best candidates</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Job Title *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Senior Python Developer"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea
                rows={5}
                className="input-field resize-none"
                placeholder="Describe the role, responsibilities, and requirements..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Remote / City"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary Range</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g. 80k-100k"
                  value={form.salary_range}
                  onChange={(e) => setForm({ ...form, salary_range: e.target.value })}
                />
              </div>
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Required Skills *</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  className="input-field flex-1"
                  placeholder="Type a skill and press Add"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                />
                <button type="button" onClick={addSkill} className="btn-secondary px-4">Add</button>
              </div>
              {form.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg">
                  {form.required_skills.map(skill => (
                    <span key={skill} className="flex items-center gap-1 bg-indigo-100 text-indigo-700 text-xs px-2.5 py-1 rounded-full">
                      {skill}
                      <button type="button" onClick={() => removeSkill(skill)}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" className="btn-primary flex-1 py-2.5" disabled={loading}>
                {loading ? 'Posting...' : 'Post Job'}
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