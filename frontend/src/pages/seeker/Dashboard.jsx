import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Briefcase, FileText, TrendingUp, CheckCircle2, ArrowRight } from 'lucide-react'
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
    { label: 'Resumes Uploaded', value: resumes.length, icon: FileText, color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
    { label: 'Jobs Available', value: jobs.length, icon: Briefcase, color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30' },
    { label: 'Profile Complete', value: '80%', icon: TrendingUp, color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  ]

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        {/* Header */}
        <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">
              Welcome back, {user?.full_name}! 👋
            </h1>
            <p className="text-white/50 text-sm mt-1">ResumeX v2.0 AI Engine • Automated resume parsing and vector matching</p>
          </div>
          <Link to="/seeker/upload" className="px-5 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl font-bold text-xs shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload New Resume
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {stats.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="p-6 bg-white/[0.03] border border-white/10 rounded-2xl flex items-center gap-5 hover:border-pink-500/30 transition-all">
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

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <Link to="/seeker/upload" className="card-glow glass-card-hover cursor-pointer group">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center text-violet-400 group-hover:scale-110 transition-transform">
                <Upload className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-violet-300 transition-colors">Upload Resume</h3>
                <p className="text-sm text-white/50">Upload your PDF or DOCX resume to extract skills</p>
              </div>
            </div>
          </Link>

          <Link to="/seeker/jobs" className="card glass-card-hover cursor-pointer group border-cyan-500/20">
            <div className="flex items-center gap-5">
              <div className="w-14 h-14 bg-cyan-500/20 border border-cyan-500/30 rounded-2xl flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                <Briefcase className="h-7 w-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-white group-hover:text-cyan-300 transition-colors">Browse Jobs</h3>
                <p className="text-sm text-white/50">Explore openings and calculate your ML match score</p>
              </div>
            </div>
          </Link>
        </div>

        {/* My Resumes Section */}
        <div className="card mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <FileText className="h-5 w-5 text-violet-400" />
              My Resumes
            </h2>
            <Link to="/seeker/upload" className="text-sm text-violet-400 hover:text-violet-300 font-medium">
              + Upload new
            </Link>
          </div>
          {loading ? (
            <div className="text-center py-12 text-white/40">Loading your resumes...</div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
              <FileText className="h-12 w-12 text-white/20 mx-auto mb-3" />
              <p className="text-white/50 mb-3">No resumes uploaded yet.</p>
              <Link to="/seeker/upload" className="btn-primary inline-block text-sm py-2 px-4">
                Upload First Resume
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map(resume => (
                <div key={resume.id} className="flex items-center justify-between p-4 bg-white/[0.03] border border-white/10 rounded-xl hover:border-violet-500/30 transition-all">
                  <div className="flex items-center gap-3.5">
                    <div className="w-10 h-10 bg-violet-500/10 border border-violet-500/20 rounded-xl flex items-center justify-center">
                      <FileText className="h-5 w-5 text-violet-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{resume.file_name}</p>
                      <p className="text-xs text-white/40 flex items-center gap-1 mt-0.5">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        {resume.is_parsed ? 'Parsed & Analyzed' : 'Processing...'}
                      </p>
                    </div>
                  </div>
                  <Link to="/seeker/jobs" className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1">
                    Match Jobs <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Latest Jobs */}
        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-cyan-400" />
              Latest Openings
            </h2>
            <Link to="/seeker/jobs" className="text-sm text-cyan-400 hover:text-cyan-300 font-medium">
              View all
            </Link>
          </div>
          {jobs.slice(0, 3).map(job => (
            <div key={job.id} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/[0.02] rounded-xl transition-colors">
              <div>
                <p className="text-base font-semibold text-white">{job.title}</p>
                <p className="text-xs text-white/40 mt-1">{job.location} • {job.salary_range || 'Competitive Salary'}</p>
              </div>
              <Link to={`/seeker/jobs/${job.id}`} className="btn-secondary text-xs py-2 px-4">
                View Job
              </Link>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}