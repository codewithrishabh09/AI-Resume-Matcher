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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome, {user?.full_name}! 🏢
            </h1>
            <p className="text-gray-500 mt-1">Manage your job listings</p>
          </div>
          <Link to="/employer/post-job" className="btn-primary flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Post New Job
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Active Jobs', value: jobs.length, icon: Briefcase, color: 'bg-indigo-100 text-indigo-600' },
            { label: 'Total Applicants', value: '—', icon: Users, color: 'bg-green-100 text-green-600' },
            { label: 'Avg Match Score', value: '—', icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
          ].map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="card flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{value}</div>
                <div className="text-sm text-gray-500">{label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Job listings */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Job Listings</h2>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : jobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 mb-4">No jobs posted yet</p>
              <Link to="/employer/post-job" className="btn-primary text-sm">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {jobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <div>
                    <h3 className="font-medium text-gray-900">{job.title}</h3>
                    <p className="text-sm text-gray-500">
                      {job.location} • {job.salary_range} •{' '}
                      <span className={`capitalize ${job.status === 'active' ? 'text-green-600' : 'text-gray-400'}`}>
                        {job.status}
                      </span>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/employer/jobs/${job.id}/matches`} className="btn-primary text-xs py-1.5 px-3">
                      Top Matches
                    </Link>
                    <Link to={`/employer/jobs/${job.id}/applications`} className="btn-secondary text-xs py-1.5 px-3">
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