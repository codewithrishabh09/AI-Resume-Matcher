import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { TrendingUp } from 'lucide-react'
import Navbar from '../../components/Navbar'
import SkillBadge from '../../components/SkillBadge'
import api from '../../api/axios'

export default function ResumeMatch() {
  const { jobId } = useParams()
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const { data } = await api.get(`/match/job/${jobId}/top-resumes?limit=20`)
        setResults(data.results || [])
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatches()
  }, [jobId])

  const getScoreBadge = (score) => {
    if (score >= 75) return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/30'
    if (score >= 50) return 'text-amber-400 bg-amber-500/20 border-amber-500/30'
    return 'text-rose-400 bg-rose-500/20 border-rose-500/30'
  }

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Top Candidate Matches</h1>
          <p className="text-white/50 text-sm mt-1">Semantic matching powered by LLMs, vector embeddings, and high-performance PostgreSQL & Redis pipeline</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-white/40">Calculating candidate similarity scores...</div>
        ) : results.length === 0 ? (
          <div className="card text-center py-16 border-white/10">
            <TrendingUp className="h-12 w-12 text-white/20 mx-auto mb-3" />
            <p className="text-white/50">No candidate resumes uploaded for matching yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={result.resume_id} className="card glass-card-hover border-white/10">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  <div className="text-2xl font-black text-white/20 w-8">
                    #{idx + 1}
                  </div>
                  <div className={`w-16 h-16 rounded-2xl border flex items-center justify-center text-xl font-extrabold shadow-lg shrink-0 ${getScoreBadge(result.match_score)}`}>
                    {result.match_score?.toFixed(0)}%
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <p className="text-base font-bold text-white">{result.file_name}</p>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/5 text-white/60 border border-white/10">
                        {result.experience_years} yrs experience
                      </span>
                    </div>
                    <p className="text-xs font-semibold text-cyan-300 mb-3 tracking-wide">{result.recommendation}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.matching_skills?.slice(0, 5).map(skill => (
                        <SkillBadge key={skill} skill={skill} type="match" />
                      ))}
                      {result.missing_skills?.slice(0, 3).map(skill => (
                        <SkillBadge key={skill} skill={skill} type="missing" />
                      ))}
                    </div>
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