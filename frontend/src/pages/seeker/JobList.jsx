import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, MapPin, DollarSign } from 'lucide-react'
import Navbar from '../../components/Navbar'
import SkillBadge from '../../components/SkillBadge'
import api from '../../api/axios'

export default function JobList() {
  const [jobs, setJobs] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true)
      try {
        const { data } = await api.get(`/jobs/?page=${page}&page_size=10`)
        setJobs(data.jobs || [])
        setTotal(data.total || 0)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchJobs()
  }, [page])

  const filtered = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.location?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Browse Jobs</h1>
          <p className="text-white/50 text-sm mt-1">{total} positions open for AI matching</p>
        </div>

        {/* Search */}
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-violet-400" />
          <input
            type="text"
            className="input-field pl-12 py-3.5 bg-white/[0.04] text-base rounded-2xl border-white/10"
            placeholder="Search positions by job title, location, or keyword..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Job list */}
        {loading ? (
          <div className="text-center py-20 text-white/40">Loading positions...</div>
        ) : filtered.length === 0 ? (
          <div className="card text-center py-16">
            <p className="text-white/50 text-base">No matching positions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id} className="card glass-card-hover border-white/10">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">{job.title}</h3>
                    <div className="flex flex-wrap gap-4 text-xs font-medium text-white/50 mb-3">
                      {job.location && (
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                          <MapPin className="h-3.5 w-3.5 text-violet-400" /> {job.location}
                        </span>
                      )}
                      {job.salary_range && (
                        <span className="flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10">
                          <DollarSign className="h-3.5 w-3.5 text-emerald-400" /> {job.salary_range}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-white/60 mb-4 line-clamp-2 leading-relaxed">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills?.slice(0, 5).map(skill => (
                        <SkillBadge key={skill} skill={skill} type="primary" />
                      ))}
                      {job.required_skills?.length > 5 && (
                        <span className="text-xs text-white/40 self-center">+{job.required_skills.length - 5} more</span>
                      )}
                    </div>
                  </div>
                  <Link to={`/seeker/jobs/${job.id}`} className="btn-primary text-xs py-2.5 px-5 whitespace-nowrap self-stretch sm:self-auto text-center">
                    View & Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 10 && (
          <div className="flex justify-center gap-3 mt-10">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-white/50 self-center">Page {page}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              disabled={jobs.length < 10}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  )
}