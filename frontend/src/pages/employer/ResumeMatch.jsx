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

  const getScoreColor = (score) => {
    if (score >= 75) return 'text-green-600 bg-green-50'
    if (score >= 50) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Top Resume Matches</h1>
          <p className="text-gray-500 mt-1">Ranked by ML match score</p>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-400">Analyzing resumes...</div>
        ) : results.length === 0 ? (
          <div className="card text-center py-12">
            <TrendingUp className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No resumes to match yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {results.map((result, idx) => (
              <div key={result.resume_id} className="card">
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-gray-300 w-8">
                    #{idx + 1}
                  </div>
                  <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-xl font-bold ${getScoreColor(result.match_score)}`}>
                    {result.match_score?.toFixed(0)}%
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium text-gray-900">{result.file_name}</p>
                      <span className="text-xs text-gray-500">
                        {result.experience_years} yrs exp
                      </span>
                    </div>
                    <p className="text-xs text-indigo-600 mb-2">{result.recommendation}</p>
                    <div className="flex flex-wrap gap-1">
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