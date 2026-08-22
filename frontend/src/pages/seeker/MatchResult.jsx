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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">

        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 text-sm"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to job
        </button>

        {loading ? (
          <div className="card text-center py-16">
            <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-gray-500">Analyzing your resume...</p>
          </div>
        ) : (
          <MatchScoreCard result={result} />
        )}
      </div>
    </div>
  )
}