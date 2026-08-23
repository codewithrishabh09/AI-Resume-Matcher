import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']
const STATUS_COLORS = {
  pending: 'bg-white/10 text-white/70 border-white/20',
  reviewed: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
  shortlisted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  rejected: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  hired: 'bg-violet-500/20 text-violet-300 border-violet-500/30'
}

export default function JobApplications() {
  const { jobId } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await api.get(`/applications/job/${jobId}`)
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchApps()
  }, [jobId])

  const updateStatus = async (appId, status) => {
    try {
      await api.patch(`/applications/${appId}/status?status=${status}`)
      toast.success('Status updated!')
      setData(prev => ({
        ...prev,
        applications: prev.applications.map(app =>
          app.application_id === appId ? { ...app, status } : app
        )
      }))
    } catch (err) {
      toast.error('Failed to update status')
    }
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Job Applications</h1>
          {data && (
            <p className="text-white/50 text-sm mt-1">
              <span className="text-violet-400 font-semibold">{data.job_title}</span> — {data.total_applications} candidates applied
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/40">Loading applications...</div>
        ) : data?.applications?.length === 0 ? (
          <div className="card text-center py-16 border-white/10">
            <User className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No applications submitted yet for this position.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.applications?.map(app => (
              <div key={app.application_id} className="card glass-card-hover border-white/10">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400">
                      <User className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-base font-semibold text-white">Candidate ID: {app.user_id.slice(0, 8)}...</p>
                      <p className="text-xs text-white/40 flex items-center gap-1.5 mt-1">
                        <Clock className="h-3.5 w-3.5" />
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                    <select
                      className="text-xs bg-[#08080C] text-white border border-white/20 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
                      value={app.status}
                      onChange={(e) => updateStatus(app.application_id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="bg-[#08080C] text-white capitalize">{s}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}