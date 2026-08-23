import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import Navbar from '../../components/Navbar'
import MatchScoreCard from '../../components/MatchScoreCard'
import api from '../../api/axios'

export default function MatchResult() {
  const { resumeId, jobId } = useParams()
  const navigate = useNavigate()
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchMatch = async () => {
      try {
        const { data } = await api.post(`/match/${resumeId}/${jobId}`)
        setResult(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMatch()
  }, [resumeId, jobId])

  return (
    <div className="min-h-screen bg-[#08080C] text-white">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white mb-8 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to job details
        </button>

        {loading ? (
          <div className="card text-center py-20 border-white/10">
            <div className="animate-spin h-10 w-10 border-4 border-violet-500 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-white/60 font-medium">Computing AI-powered skill extraction and semantic job matching via vector embeddings...</p>
          </div>
        ) : (
          <MatchScoreCard result={result} />
        )}
      </div>
    </div>
  )
}