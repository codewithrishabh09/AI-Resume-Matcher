import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, DollarSign, Zap } from 'lucide-react'
import toast from 'react-hot-toast'
import Navbar from '../../components/Navbar'
import SkillBadge from '../../components/SkillBadge'
import api from '../../api/axios'

export default function JobDetail() {
  const { jobId } = useParams()
  const navigate = useNavigate()
  const [job, setJob] = useState(null)
  const [resumes, setResumes] = useState([])
  const [selectedResume, setSelectedResume] = useState('')
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)
  const [matching, setMatching] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobRes, resumeRes] = await Promise.all([
          api.get(`/jobs/${jobId}`),
          api.get('/resumes/')
        ])
        setJob(jobRes.data)
        setResumes(resumeRes.data)
        if (resumeRes.data.length > 0) setSelectedResume(resumeRes.data[0].id)
      } catch (err) {
        toast.error('Job not found')
        navigate('/seeker/jobs')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [jobId])

  const handleMatch = async () => {
    if (!selectedResume) return toast.error('Please upload a resume first')
    setMatching(true)
    try {
      await api.post(`/match/${selectedResume}/${jobId}`)
      navigate(`/seeker/match/${selectedResume}/${jobId}`)
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Matching failed')
    } finally {
      setMatching(false)
    }
  }

  const handleApply = async () => {
    if (!selectedResume) return toast.error('Please upload a resume first')
    setApplying(true)
    try {
      await api.post(`/applications/${jobId}?resume_id=${selectedResume}`)
      toast.success('Application submitted!')
    } catch (err) {
      toast.error(err.response?.data?.detail || 'Application failed')
    } finally {
      setApplying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="flex items-center justify-center py-32 text-white/40">Loading job details...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h1 className="text-3xl font-extrabold text-white mb-3 tracking-tight">{job?.title}</h1>
              <div className="flex flex-wrap gap-4 text-xs font-medium text-white/60 mb-6">
                {job?.location && (
                  <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                    <MapPin className="h-3.5 w-3.5 text-violet-400" /> {job.location}
                  </span>
                )}
                {job?.salary_range && (
                  <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-md border border-white/10">
                    <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {job.salary_range}
                  </span>
                )}
                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-xs font-semibold uppercase tracking-wider">
                  {job?.status || 'Active'}
                </span>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">Job Description</h3>
                <p className="text-white/70 leading-relaxed text-sm whitespace-pre-line">{job?.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-3">Required Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {job?.required_skills?.map(skill => (
                    <SkillBadge key={skill} skill={skill} type="primary" />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Panel */}
          <div>
            <div className="card-glow sticky top-24">
              <h3 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                <Zap className="h-5 w-5 text-cyan-400" />
                Apply & Match
              </h3>

              {resumes.length === 0 ? (
                <div className="text-center py-6 border border-dashed border-white/10 rounded-xl bg-white/[0.02]">
                  <p className="text-sm text-white/50 mb-4">No resume found on your profile</p>
                  <button
                    onClick={() => navigate('/seeker/upload')}
                    className="btn-primary w-full text-sm py-2.5"
                  >
                    Upload Resume
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-6">
                    <label className="block text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">
                      Select Resume
                    </label>
                    <select
                      className="input-field text-sm py-3 bg-[#08080C] text-white border-white/20"
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                    >
                      {resumes.map(r => (
                        <option key={r.id} value={r.id} className="bg-[#08080C] text-white">{r.file_name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleMatch}
                    disabled={matching}
                    className="btn-primary w-full mb-3 py-3 flex items-center justify-center gap-2 font-bold shadow-violet-600/30"
                  >
                    <Zap className="h-4 w-4 text-cyan-300" />
                    {matching ? 'Calculating ML Match...' : 'Calculate AI Match Score'}
                  </button>

                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="btn-secondary w-full py-3 font-semibold"
                  >
                    {applying ? 'Submitting...' : 'Apply for this Role'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}