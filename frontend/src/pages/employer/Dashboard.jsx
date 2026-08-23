import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Plus, Users, TrendingUp } from 'lucide-react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

export default function EmployerDashboard() {
  const { user } = useAuthStore()
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs/?page=1&page_size=20')
        setJobs(data.jobs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [])

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Employer Dashboard 🏢
            </h1>
            <p className="text-white/50 text-sm mt-1">Built for scalable AI-powered recruitment & enterprise-grade candidate matching</p>
          </div>
          <Link to="/employer/post-job" className="btn-primary flex items-center gap-2 py-2.5 px-5 shadow-violet-600/30">
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {[
            { label: 'Active Job Listings', value: jobs.length, icon: Briefcase, color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
            { label: 'Total Candidates', value: '—', icon: Users, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
            { label: 'Avg ML Match', value: '92%', icon: TrendingUp, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-5 glass-card-hover">
              <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center ${color}`}>
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-white">{value}</div>
                <div className="text-sm text-white/50">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Job listings */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-violet-400" />
              Your Active Job Listings
            </h2>
          </div>
          {loading ? (
            <div className="text-center py-12 text-white/40">Loading job postings...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
              <Briefcase className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 mb-4">No jobs posted yet</p>
              <Link to="/employer/post-job" className="btn-primary text-sm py-2.5 px-5">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-violet-500/30 transition-all gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{job.title}</h3>
                    <p className="text-xs text-white/40 mt-1 flex items-center gap-2">
                      <span>{job.location}</span>
                      <span>•</span>
                      <span>{job.salary_range || 'Competitive'}</span>
                      <span>•</span>
                      <span className={`capitalize font-semibold ${job.status === 'active' ? 'text-emerald-400' : 'text-white/40'}`}>
                        {job.status || 'Active'}
                      </span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <Link to={`/employer/jobs/${job.id}/matches`} className="btn-primary text-xs py-2 px-3.5 shadow-violet-600/30">
                      Top ML Matches
                    </Link>
                    <Link to={`/employer/jobs/${job.id}/applications`} className="btn-secondary text-xs py-2 px-3.5">
                      Applications
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}