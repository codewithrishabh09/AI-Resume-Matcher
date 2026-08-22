import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { User, Clock } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'

const STATUS_OPTIONS = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired']
const STATUS_COLORS = {
  pending: 'bg-gray-100 text-gray-700',
  reviewed: 'bg-blue-100 text-blue-700',
  shortlisted: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
  hired: 'bg-indigo-100 text-indigo-700'
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Applications</h1>
          {data && (
            <p className="text-gray-500 mt-1">
              {data.job_title} — {data.total_applications} applicants
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading...</div>
        ) : data?.applications?.length === 0 ? (
          <div className="card text-center py-12">
            <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No applications yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.applications?.map(app => (
              <div key={app.application_id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Applicant ID: {app.user_id.slice(0, 8)}...</p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(app.applied_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${STATUS_COLORS[app.status]}`}>
                      {app.status}
                    </span>
                    <select
                      className="text-xs border border-gray-300 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                      value={app.status}
                      onChange={(e) => updateStatus(app.application_id, e.target.value)}
                    >
                      {STATUS_OPTIONS.map(s => (
                        <option key={s} value={s} className="capitalize">{s}</option>
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