import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Briefcase, Clock, ArrowRight, FileText } from 'lucide-react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const statusStyles = {
  pending: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
  shortlisted: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
  applied: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
}

export default function MyApplications() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await api.get('/applications/my')
        setApplications(res.data || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchApplications()
  }, [])

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            My Applications 📋
          </h1>
          <p className="text-white/50 text-sm mt-1">Track the status of every job you've applied to</p>
        </div>

        <div className="card">
          {loading ? (
            <div className="text-center py-12 text-white/40">Loading your applications...</div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
              <Briefcase className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 mb-3">You haven't applied to any jobs yet.</p>
              <Link to="/seeker/jobs" className="btn-primary inline-block text-sm py-2 px-4">
                Browse Jobs
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.map(app => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-pink-500/30 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-cyan-500/10 border border-cyan-500/20 rounded-xl flex items-center justify-center">
                      <Briefcase className="h-5 w-5 text-cyan-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {app.job_title || app.job?.title || 'Job'}
                      </p>
                      <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                        <Clock className="h-3 w-3" />
                        Applied {app.applied_at ? new Date(app.applied_at).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase border ${statusStyles[app.status] || statusStyles.pending}`}>
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}