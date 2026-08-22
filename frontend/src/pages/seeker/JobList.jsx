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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">

        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Browse Jobs</h1>
          <p className="text-gray-500 mt-1">{total} jobs available</p>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            className="input-field pl-10"
            placeholder="Search by title or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Job list */}
        {loading ? (
          <div className="text-center py-20 text-gray-400">Loading jobs...</div>
        ) : (
          <div className="space-y-4">
            {filtered.map(job => (
              <div key={job.id} className="card hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{job.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-500 mb-3">
                      {job.location && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" /> {job.location}
                        </span>
                      )}
                      {job.salary_range && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" /> {job.salary_range}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{job.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {job.required_skills?.slice(0, 5).map(skill => (
                        <SkillBadge key={skill} skill={skill} type="primary" />
                      ))}
                      {job.required_skills?.length > 5 && (
                        <span className="text-xs text-gray-400">+{job.required_skills.length - 5} more</span>
                      )}
                    </div>
                  </div>
                  <Link to={`/seeker/jobs/${job.id}`} className="btn-primary ml-4 text-sm whitespace-nowrap">
                    View & Match
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {total > 10 && (
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500 self-center">Page {page}</span>
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