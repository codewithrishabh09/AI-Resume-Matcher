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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-20 text-gray-400">Loading...</div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Job Details */}
          <div className="lg:col-span-2">
            <div className="card mb-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{job?.title}</h1>
              <div className="flex gap-4 text-sm text-gray-500 mb-4">
                {job?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" /> {job.location}
                  </span>
                )}
                {job?.salary_range && (
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" /> {job.salary_range}
                  </span>
                )}
                <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs capitalize">
                  {job?.status}
                </span>
              </div>
              <p className="text-gray-600 leading-relaxed mb-4">{job?.description}</p>
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Required Skills</h3>
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
            <div className="card sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Apply & Match</h3>

              {resumes.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-3">Upload a resume first</p>
                  <button
                    onClick={() => navigate('/seeker/upload')}
                    className="btn-primary w-full text-sm"
                  >
                    Upload Resume
                  </button>
                </div>
              ) : (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Select Resume
                    </label>
                    <select
                      className="input-field text-sm"
                      value={selectedResume}
                      onChange={(e) => setSelectedResume(e.target.value)}
                    >
                      {resumes.map(r => (
                        <option key={r.id} value={r.id}>{r.file_name}</option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={handleMatch}
                    disabled={matching}
                    className="btn-primary w-full mb-3 flex items-center justify-center gap-2"
                  >
                    <Zap className="h-4 w-4" />
                    {matching ? 'Analyzing...' : 'Check Match Score'}
                  </button>

                  <button
                    onClick={handleApply}
                    disabled={applying}
                    className="btn-secondary w-full"
                  >
                    {applying ? 'Applying...' : 'Apply Now'}
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