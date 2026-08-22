import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Briefcase, FileText, TrendingUp } from 'lucide-react'
import Navbar from '../../components/Navbar'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

export default function SeekerDashboard() {
  const { user } = useAuthStore()
  const [resumes, setResumes] = useState([])
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumeRes, jobRes] = await Promise.all([
          api.get('/resumes/'),
          api.get('/jobs/?page=1&page_size=5')
        ])
        setResumes(resumeRes.data)
        setJobs(jobRes.data.jobs || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const stats = [
    { label: 'Resumes Uploaded', value: resumes.length, icon: FileText, color: 'bg-indigo-100 text-indigo-600' },
    { label: 'Jobs Available', value: jobs.length, icon: Briefcase, color: 'bg-green-100 text-green-600' },
    { label: 'Profile Complete', value: '80%', icon: TrendingUp, color: 'bg-amber-100 text-amber-600' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.full_name}! 👋
          </h1>
          <p className="text-gray-500 mt-1">Find your perfect job match today</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map(({ label, value, icon: Icon, color }) => (
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Link to="/seeker/upload" className="card hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
                <Upload className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Upload Resume</h3>
                <p className="text-sm text-gray-500">Upload your PDF or DOCX resume</p>
              </div>
            </div>
          </Link>

          <Link to="/seeker/jobs" className="card hover:border-indigo-300 hover:shadow-md transition-all cursor-pointer group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center group-hover:bg-green-200 transition-colors">
                <Briefcase className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Browse Jobs</h3>
                <p className="text-sm text-gray-500">Find and match to available positions</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Resumes */}
        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">My Resumes</h2>
            <Link to="/seeker/upload" className="text-sm text-indigo-600 hover:underline">+ Upload new</Link>
          </div>
          {loading ? (
            <div className="text-center py-8 text-gray-400">Loading...</div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No resumes yet.</p>
              <Link to="/seeker/upload" className="btn-primary mt-3 inline-block text-sm">
                Upload Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-indigo-600" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">{resume.file_name}</p>
                      <p className="text-xs text-gray-500">
                        {resume.is_parsed ? '✅ Parsed' : '⏳ Processing'}
                      </p>
                    </div>
                  </div>
                  <Link to="/seeker/jobs" className="text-xs text-indigo-600 hover:underline">
                    Match to jobs →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Jobs */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Latest Jobs</h2>
            <Link to="/seeker/jobs" className="text-sm text-indigo-600 hover:underline">See all</Link>
          </div>
          {jobs.slice(0, 3).map(job => (
            <div key={job.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{job.title}</p>
                <p className="text-xs text-gray-500">{job.location} • {job.salary_range}</p>
              </div>
              <Link to={`/seeker/jobs/${job.id}`} className="text-xs btn-primary py-1 px-3">
                View
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}